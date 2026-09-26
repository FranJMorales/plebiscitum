import LegalLayout from './LegalLayout';

// ⚠️ A diferencia de las otras 3 páginas legales, no pude recuperar ningún
// fragmento de "Términos de uso" del bundle original — esta página es
// contenido estándar de partida, no una reconstrucción. Revísala y
// personalízala antes de publicar.
export default function Terminos() {
  return (
    <LegalLayout title="Términos de Uso">
      <p>
        Estos términos regulan el acceso y uso de la plataforma Plebiscitum por parte de las
        personas registradas.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Objeto del servicio</h2>
      <p>
        Plebiscitum es una plataforma ciudadana que traduce a lenguaje claro las iniciativas
        publicadas en el Boletín Oficial del Estado y permite a las personas registradas expresar
        su opinión sobre ellas mediante el voto.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Requisitos de registro</h2>
      <p>
        Para votar es necesario registrarse con datos reales y verificables: nombre completo,
        correo electrónico, DNI/NIE y teléfono móvil. Cada DNI/NIE y cada teléfono solo pueden
        asociarse a una única cuenta.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Uso indebido</h2>
      <p>
        No está permitido crear cuentas falsas, suplantar la identidad de terceros, ni intentar
        eludir los mecanismos de verificación de identidad única de la plataforma.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Naturaleza del voto</h2>
      <p>
        El voto emitido en Plebiscitum no tiene, a día de hoy, efecto legalmente vinculante sobre
        el proceso legislativo. Los resultados agregados se canalizan hacia las instituciones
        correspondientes como mecanismo de expresión ciudadana (Derecho de Petición).
      </p>
    </LegalLayout>
  );
}
