import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Durante "npm run dev", las peticiones a /api/boe se redirigen al script PHP
// solo en producción (Hostinger). En local, o instalas PHP y usas `php -S`,
// o comenta el proxy y deja que el BoeTicker use directamente los datos de
// respaldo (ya incluidos como fallback en el componente).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
});
