// Ingesta diaria del BOE para Plebiscitum.
//
// Llama a la API oficial de datos abiertos del BOE (sumario diario), se queda
// solo con la Sección I ("Disposiciones generales" — leyes, reales decretos,
// decretos-ley, órdenes con alcance general), usa un modelo de IA para decidir
// si cada disposición es relevante para la opinión ciudadana y para traducirla
// a lenguaje llano, y guarda el resultado en la tabla `iniciativas`.
//
// Se invoca vía pg_cron (ver migración `programar_ingesta_boe`) con un secreto
// compartido en la cabecera `x-cron-secret`, o manualmente para pruebas.
//
// ⚠️ Aviso de fiabilidad: la forma exacta del JSON que devuelve la API del BOE
// no se ha podido verificar contra una respuesta real desde este entorno (sin
// salida de red a boe.es). El código recorre el JSON de forma recursiva y
// tolera varias formas habituales de conversión XML→JSON, pero conviene
// revisar los logs de la primera ejecución real y ajustar `extraerTexto`/
// `recolectarItems` si algún campo no aparece donde se espera.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const CRON_SECRET = "79068a182d908ea7aa73193296eb440bec1c731fb3abe781c47c02d76d49e500";
const SECCION_RELEVANTE = "1"; // Disposiciones generales

function extraerTexto(campo: unknown): string | null {
  if (campo === null || campo === undefined) return null;
  if (typeof campo === "string") return campo;
  if (typeof campo === "number") return String(campo);
  if (typeof campo === "object") {
    const obj = campo as Record<string, unknown>;
    const candidato = obj.texto ?? obj._ ?? obj["$"] ?? obj.value ?? obj.nombre ?? obj.codigo;
    if (typeof candidato === "string") return candidato;
  }
  return null;
}

interface ItemBOE {
  identificador?: string;
  titulo?: string;
  url_html?: unknown;
  url_pdf?: unknown;
  _seccion?: unknown;
  _departamento?: unknown;
}

function recolectarItems(nodo: unknown, ctx: { seccion?: unknown; departamento?: unknown }, out: ItemBOE[]) {
  if (Array.isArray(nodo)) {
    for (const n of nodo) recolectarItems(n, ctx, out);
    return;
  }
  if (nodo && typeof nodo === "object") {
    const obj = nodo as Record<string, unknown>;
    const nuevoCtx = { ...ctx };
    if (obj.seccion) nuevoCtx.seccion = obj.seccion;
    if (obj.departamento) nuevoCtx.departamento = obj.departamento;

    if (typeof obj.identificador === "string" && typeof obj.titulo === "string") {
      out.push({ ...(obj as ItemBOE), _seccion: nuevoCtx.seccion, _departamento: nuevoCtx.departamento });
    }
    for (const key of Object.keys(obj)) {
      if (key === "seccion" || key === "departamento") continue;
      recolectarItems(obj[key], nuevoCtx, out);
    }
  }
}

function limpiarHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&aacute;/gi, "á").replace(/&eacute;/gi, "é").replace(/&iacute;/gi, "í")
    .replace(/&oacute;/gi, "ó").replace(/&uacute;/gi, "ú").replace(/&ntilde;/gi, "ñ")
    .replace(/\s+/g, " ")
    .trim();
}

function extraerJson(texto: string): Record<string, unknown> | null {
  try {
    return JSON.parse(texto);
  } catch {
    const match = texto.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

Deno.serve(async (req: Request) => {
  const secretoRecibido = req.headers.get("x-cron-secret");
  if (secretoRecibido !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: claveIA, error: errorClave } = await supabase.rpc("get_secret", {
      secret_name: "anthropic_api_key",
    });
    if (errorClave || !claveIA) {
      return new Response(
        JSON.stringify({ error: "No hay clave de IA configurada en el Vault (anthropic_api_key)" }),
        { status: 500 },
      );
    }

    const url = new URL(req.url);
    const fechaParam = url.searchParams.get("fecha");
    const fecha = fechaParam ?? new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const fechaIso = `${fecha.slice(0, 4)}-${fecha.slice(4, 6)}-${fecha.slice(6, 8)}`;

    const sumarioResp = await fetch(`https://www.boe.es/datosabiertos/api/boe/sumario/${fecha}`, {
      headers: { Accept: "application/json" },
    });

    if (!sumarioResp.ok) {
      return new Response(
        JSON.stringify({ error: `No se pudo obtener el sumario del BOE (HTTP ${sumarioResp.status})`, fecha }),
        { status: 502 },
      );
    }

    const sumarioJson = await sumarioResp.json();
    const items: ItemBOE[] = [];
    recolectarItems(sumarioJson, {}, items);

    const relevantesPorSeccion = items.filter((item) => {
      const codigoSeccion = extraerTexto((item._seccion as Record<string, unknown>)?.["codigo"] ?? item._seccion);
      return codigoSeccion === SECCION_RELEVANTE;
    });

    let insertadas = 0;
    const errores: string[] = [];

    for (const item of relevantesPorSeccion) {
      try {
        const urlHtml = extraerTexto(item.url_html) ??
          `https://www.boe.es/diario_boe/txt.php?id=${item.identificador}`;

        let textoPlano = "";
        try {
          const htmlResp = await fetch(urlHtml);
          if (htmlResp.ok) {
            textoPlano = limpiarHtml(await htmlResp.text()).slice(0, 15000);
          }
        } catch {
          // si no se puede descargar el texto completo, seguimos solo con el título
        }

        const mensajeIA = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": claveIA as string,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5",
            max_tokens: 1024,
            system:
              'Ayudas a una plataforma ciudadana española (Plebiscitum) a decidir qué normas del BOE son ' +
              'relevantes para que la ciudadanía opine, y a traducirlas a lenguaje llano. ' +
              'Responde EXCLUSIVAMENTE con un objeto JSON válido (sin texto adicional, sin markdown) con esta forma: ' +
              '{"relevante": boolean, "titulo_claro": string, "resumen_claro": string}. ' +
              '"relevante" es true solo para normas con impacto directo y significativo en la vida de la ciudadanía ' +
              '(leyes, reales decretos, decretos-ley, reglamentos de alcance general); false para nombramientos, ' +
              'subvenciones puntuales, convenios administrativos, anuncios o trámites internos. ' +
              '"titulo_claro": máximo 15 palabras, lenguaje llano. ' +
              '"resumen_claro": 2 a 4 frases en español sencillo, sin jerga jurídica, explicando qué cambia y a quién afecta.',
            messages: [
              {
                role: "user",
                content: `Título oficial: "${item.titulo}"\n\nTexto de la disposición:\n\n${
                  textoPlano || "(no se pudo obtener el texto completo; usa solo el título)"
                }`,
              },
            ],
          }),
        });

        if (!mensajeIA.ok) {
          errores.push(`IA falló para ${item.identificador}: HTTP ${mensajeIA.status}`);
          continue;
        }

        const cuerpoIA = await mensajeIA.json();
        const textoRespuesta = cuerpoIA?.content?.[0]?.text ?? "";
        const resultado = extraerJson(textoRespuesta);

        if (!resultado || resultado.relevante !== true) {
          continue;
        }

        const departamento = extraerTexto((item._departamento as Record<string, unknown>)?.["nombre"] ?? item._departamento);

        const { error: errorInsert } = await supabase
          .from("iniciativas")
          .upsert(
            {
              boe_id: item.identificador,
              titulo_original: (resultado.titulo_claro as string) || item.titulo,
              resumen_simple: resultado.resumen_claro as string,
              enlace_boe: urlHtml,
              fecha_publicacion: fechaIso,
              departamento,
              seccion_codigo: SECCION_RELEVANTE,
              estado: "abierta",
            },
            { onConflict: "boe_id", ignoreDuplicates: true },
          );

        if (errorInsert) {
          errores.push(`Insert falló para ${item.identificador}: ${errorInsert.message}`);
        } else {
          insertadas++;
        }
      } catch (err) {
        errores.push(`Error procesando ${item.identificador}: ${(err as Error).message}`);
      }
    }

    return new Response(
      JSON.stringify({
        fecha: fechaIso,
        items_seccion_1: relevantesPorSeccion.length,
        insertadas,
        errores,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
