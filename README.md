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
- **Backend**: [Supabase](https://supabase.com) (Postgres, Auth, Edge Functions, Vault)
- **Hosting**: Hostinger (estático) + `api/boe.php` (proxy al RSS del BOE)
- **Email**: Resend (pendiente de conectar la notificación de nuevos registros)

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
