import LegalLayout from './LegalLayout';

// ⚠️ Reconstruido a partir de los 3 apartados recuperados del bundle original
// (Titularidad, Propiedad Intelectual, Exclusión de garantías). Revisa antes
// de publicar.
export default function Legal() {
  return (
    <LegalLayout title="Aviso Legal">
      <p>El presente aviso legal regula el uso de los servicios del portal web Plebiscitum.</p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Titularidad</h2>
      <p>
        Plebiscitum es una plataforma gestionada independientemente como bien social. El
        responsable ante contacto y aspectos técnicos es el titular y desarrollador Francisco
        Javier Morales (contacto: hola@javimorales.net).
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Propiedad Intelectual e Industrial</h2>
      <p>
        Los contenidos, estructura, diseño y código fuente de esta página web son propiedad de sus
        titulares y están protegidos por la normativa de propiedad intelectual e industrial,
        permitiéndose el uso Open Source bajo la licencia estipulada en su repositorio.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Exclusión de garantías y responsabilidad</h2>
      <p>
        El titular no garantiza la continuidad, disponibilidad y utilidad del portal de manera
        permanente, ni será responsable por los posibles daños derivados de la falta de
        disponibilidad del mismo o fallos técnicos imputables a terceros.
      </p>
    </LegalLayout>
  );
}
