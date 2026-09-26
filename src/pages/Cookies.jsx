import LegalLayout from './LegalLayout';

// ⚠️ Reconstruido a partir de los 3 apartados recuperados del bundle original.
// Actualizado: "Firebase Auth" → "Supabase Auth" tras la migración. Revisa
// antes de publicar.
export default function Cookies() {
  return (
    <LegalLayout title="Política de Cookies">
      <p>Esta política explica qué son las cookies y cómo las usamos en Plebiscitum.</p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita
        un sitio web. Ayudan a que el sitio web funcione correctamente y a mejorar la experiencia
        del usuario.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Cómo usamos las cookies</h2>
      <p>
        En Plebiscitum, utilizamos cookies estrictamente necesarias para el funcionamiento de la
        plataforma, como para mantener la sesión de autenticación (a través de Supabase Auth) y
        gestionar sus preferencias de seguridad.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Gestión de cookies</h2>
      <p>
        Puede configurar su navegador para rechazar o eliminar las cookies en cualquier momento.
        Sin embargo, dada la arquitectura de autenticación segura que empleamos, deshabilitar
        cookies podría afectar al correcto funcionamiento de su sesión.
      </p>
    </LegalLayout>
  );
}
