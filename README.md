# Plebiscitum

Plataforma ciudadana que traduce a lenguaje claro las iniciativas publicadas
en el BOE, permite votarlas y agrega los resultados para enviarlos al
gobierno a través de sus canales oficiales de contacto.

## Origen de este repositorio

Este proyecto se generó originalmente con Google AI Studio y solo existía
como build compilado (carpeta `dist/`, servida desde Hostinger). Este
repositorio reconstruye el código fuente en React + Vite a partir de:

- El contenido y las clases de Tailwind extraídas del bundle compilado
  (`assets/index-*.js` / `.css` del ZIP original).
- El backend PHP (`api/boe.php`) y las reglas de `.htaccess`, que se copiaron
  sin cambios porque no estaban minificados.
- El nuevo backend en Supabase (base de datos, Auth y Edge Functions), que
  sustituye a la integración anterior con Firebase.

**Páginas legales (`src/pages/`)**: `Privacidad.jsx`, `Cookies.jsx` y
`Legal.jsx` se reconstruyeron a partir de fragmentos de texto recuperados del
bundle original, actualizados para reflejar la migración a Supabase y los
nuevos datos de registro (DNI/NIE, teléfono). `Terminos.jsx` es contenido de
partida porque no se pudo recuperar ningún fragmento original. **Revisa las
cuatro páginas con detalle antes de publicarlas — no sustituyen asesoría
legal.**

**Cambios de copy respecto al original**: se retiraron las menciones a
"tecnología blockchain" y "cifrado de extremo a extremo" (Voto Digital, FAQ)
porque no hay ninguna implementación real detrás de esas afirmaciones
todavía. Si en el futuro se implementan, se pueden volver a añadir.

## Stack

- **Frontend**: React 18 + Vite + Tailwind CSS v4 + Framer Motion
- **Backend**: [Supabase](https://supabase.com) (Postgres, Auth, Edge Functions, Vault, pg_cron, pg_net)
- **Hosting**: Hostinger (estático) + `api/boe.php` (proxy al RSS del BOE, solo para el ticker de la home)
- **Email**: Resend
- **IA**: Anthropic (clasificación y traducción a lenguaje claro de las disposiciones del BOE)

## Ciclo de vida de una iniciativa (automatizado)

1. **Ingesta diaria** (`supabase/functions/ingesta-boe`, cron `0 8 * * *`): llama a la
   API oficial de datos abiertos del BOE, se queda con la Sección I (disposiciones
   generales: leyes, reales decretos, órdenes de alcance general) y usa un modelo de
   IA para decidir si cada una es relevante para la ciudadanía y traducirla a lenguaje
   llano. Inserta el resultado en `iniciativas` (idempotente por `boe_id`).
2. **Notificación a usuarios registrados** (trigger `on_iniciativa_publicada`): al
   publicarse una iniciativa nueva, se avisa por email a todas las cuentas registradas.
3. **Votación**: cualquier persona registrada (DNI/NIE + teléfono verificados) vota
   una vez por iniciativa desde `/iniciativas`. Los resultados agregados son públicos
   (`resultados_votacion`), los votos individuales no.
4. **Cierre automático** (cron `30 2 * * *`): pasada `fecha_cierre_votacion`, la
   iniciativa pasa a `cerrada`.
5. **Informe periódico a buzones oficiales** (cron semanal, lunes `0 7 * * 1`): agrega
   los resultados de las iniciativas cerradas desde el último informe y los envía a
   `informacion@congreso.es` e `informacion@senado.es` como informe de transparencia
   ciudadana — **no** es un procedimiento formal de Derecho de Petición (ese exige
   identificar al peticionario vía Cl@ve/certificado digital, uno por uno).

### Pendiente para que las automatizaciones envíen correo de verdad

- **Clave de IA**: falta guardar `anthropic_api_key` en el Vault de Supabase para que
  la ingesta funcione (sin ella, la función responde con un error controlado).
- **Dominio verificado en Resend**: la cuenta de Resend no tiene ningún dominio
  verificado. Sin uno, Resend solo entrega a la dirección del propio titular de la
  cuenta — ni las notificaciones a usuarios registrados ni el informe a
  Congreso/Senado llegarán a su destino real hasta que se verifique un dominio propio
  (p. ej. `plebiscitum.es`) en Resend y se actualicen los remitentes `from` en las
  funciones/triggers correspondientes.
- La forma exacta del JSON del sumario del BOE no se ha podido verificar contra una
  respuesta real desde este entorno (sin salida de red a boe.es) — revisar los logs
  de la primera ejecución real de `ingesta-boe` y ajustar el parseo si hiciera falta.

## Desarrollo local

```bash
npm install
cp .env.example .env   # ya trae la URL y la clave pública del proyecto Supabase
npm run dev
```

## Despliegue a Hostinger

```bash
npm run build
```

Sube el contenido de `dist/` (que incluye `index.html`, `assets/`,
`manifest.json`, los iconos y `.htaccess`) a la raíz del hosting, y sube
también la carpeta `api/` con `boe.php` junto a él.

## Estructura

```
src/
  components/   Hero, Features, Roadmap, FAQ, Nav, Footer, BoeTicker, WaitlistForm
  pages/        Páginas legales
  lib/          Cliente de Supabase y validador de DNI/NIE
api/
  boe.php       Proxy al RSS del BOE (para Hostinger)
public/         manifest.json, iconos, .htaccess (se copian tal cual al build)
```
