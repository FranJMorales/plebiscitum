import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const LETRAS = "TRWAGMYFPDXBNJZSQVHLCKE";

function validarDniNie(valor: string) {
  const v = valor.toUpperCase().trim().replace(/[^0-9A-Z]/g, "");
  const dniRe = /^(\d{8})([A-Z])$/;
  const nieRe = /^([XYZ])(\d{7})([A-Z])$/;

  const dniMatch = v.match(dniRe);
  const nieMatch = v.match(nieRe);

  let numero: number;
  let letra: string;

  if (dniMatch) {
    numero = parseInt(dniMatch[1], 10);
    letra = dniMatch[2];
  } else if (nieMatch) {
    const mapa: Record<string, string> = { X: "0", Y: "1", Z: "2" };
    numero = parseInt(mapa[nieMatch[1]] + nieMatch[2], 10);
    letra = nieMatch[3];
  } else {
    return { valido: false, normalizado: v };
  }

  return { valido: LETRAS[numero % 23] === letra, normalizado: v };
}

const TELEFONO_RE = /^\+34[6-9]\d{8}$/;

function cors(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    },
  });
}

// Registro (alta) Y reingreso de usuarios existentes en un mismo endpoint.
//
// Si el DNI/NIE o el teléfono ya pertenecen a una cuenta:
//   - con el MISMO email → es la misma persona volviendo a entrar: se le
//     reenvía el enlace mágico sin tocar sus datos (evita el bug de quedarse
//     fuera de tu propia cuenta por la restricción de unicidad).
//   - con OTRO email → 409, alguien más ya usa ese DNI/teléfono.
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return cors({}, 200);
  if (req.method !== "POST") return cors({ error: "Metodo no permitido" }, 405);

  try {
    const { full_name, email, dni_nie, phone } = await req.json();

    if (!full_name || !email || !dni_nie || !phone) {
      return cors({ error: "Faltan campos obligatorios" }, 400);
    }

    const { valido, normalizado } = validarDniNie(String(dni_nie));
    if (!valido) {
      return cors({ error: "El DNI/NIE no es valido" }, 400);
    }

    if (!TELEFONO_RE.test(String(phone))) {
      return cors({ error: "El telefono debe ser un movil espanol (+34...)" }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data: hash, error: hashError } = await supabase.rpc("hash_dni", {
      p_dni_nie: normalizado,
    });
    if (hashError) {
      console.error(hashError);
      return cors({ error: "Error interno" }, 500);
    }

    const { data: perfilPorDni } = await supabase
      .from("profiles")
      .select("id")
      .eq("dni_nie_hash", hash)
      .maybeSingle();

    const { data: perfilPorTelefono } = await supabase
      .from("profiles")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    if (perfilPorDni && perfilPorTelefono && perfilPorDni.id !== perfilPorTelefono.id) {
      return cors({ error: "El DNI/NIE y el telefono no coinciden con la misma cuenta." }, 409);
    }

    const perfilExistente = perfilPorDni ?? perfilPorTelefono;

    if (perfilExistente) {
      const { data: usuarioExistente, error: errorUsuario } = await supabase.auth.admin.getUserById(
        perfilExistente.id,
      );

      if (errorUsuario || !usuarioExistente?.user) {
        console.error(errorUsuario);
        return cors({ error: "Error interno" }, 500);
      }

      if ((usuarioExistente.user.email ?? "").toLowerCase() !== String(email).toLowerCase()) {
        return cors(
          { error: "Ese DNI/NIE o telefono ya esta asociado a una cuenta con otro email. Si es tuya, entra con ese email." },
          409,
        );
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({ email });
      if (otpError) {
        console.error(otpError);
        return cors({ error: "No se pudo enviar el enlace de acceso." }, 500);
      }
      return cors({ ok: true, returning: true }, 200);
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { full_name, dni_nie_hash: hash, phone },
      },
    });

    if (otpError) {
      console.error(otpError);
      return cors({ error: "No se pudo enviar el enlace de acceso." }, 500);
    }

    return cors({ ok: true }, 200);
  } catch (e) {
    console.error(e);
    return cors({ error: "Solicitud invalida" }, 400);
  }
});
