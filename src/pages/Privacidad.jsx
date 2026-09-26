import LegalLayout from './LegalLayout';

// ⚠️ Reconstruido a partir del fragmento recuperado del bundle original
// ("En Plebiscitum, nos tomamos muy en serio la privacidad...") más el resto
// de secciones estándar necesarias para cubrir RGPD. Actualizado para
// reflejar la migración de Firebase a Supabase y los nuevos datos exigidos
// en el registro (DNI/NIE, teléfono). REVISA este texto con detalle antes
// de publicarlo — no sustituye asesoría legal.
export default function Privacidad() {
  return (
    <LegalLayout title="Política de Privacidad">
      <p>
        En Plebiscitum, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política
        describe cómo recopilamos, usamos y protegemos su información de acuerdo con las leyes
        aplicables de protección de datos, incluido el Reglamento General de Protección de Datos
        (RGPD).
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Responsable del tratamiento</h2>
      <p>
        El responsable del tratamiento de sus datos es Francisco Javier Morales, titular y
        desarrollador de Plebiscitum. Para cualquier consulta relacionada con sus datos, puede
        escribir a hola@javimorales.net.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Datos que recopilamos</h2>
      <p>Para poder registrarte y garantizar que cada persona vota una única vez, recopilamos:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Nombre y apellidos.</li>
        <li>Correo electrónico, usado para el acceso mediante enlace de un solo uso (sin contraseña).</li>
        <li>
          DNI/NIE: nunca se almacena el número en claro. Se guarda únicamente un hash criptográfico
          irreversible, generado con una clave secreta que no sale de nuestra infraestructura, y que
          solo sirve para impedir que un mismo documento registre dos cuentas.
        </li>
        <li>Teléfono móvil, usado como segundo factor de unicidad y, opcionalmente, para notificaciones.</li>
        <li>El voto emitido en cada iniciativa (a favor / en contra / abstención).</li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Cómo protegemos su voto</h2>
      <p>
        Los resultados que se muestran públicamente son siempre recuentos agregados por iniciativa.
        Ninguna persona, ni siquiera el equipo de Plebiscitum, puede consultar cómo ha votado un
        usuario concreto a través de la interfaz pública.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Encargados del tratamiento</h2>
      <p>
        Utilizamos Supabase (base de datos, autenticación y funciones de servidor) como encargado
        del tratamiento, y Resend para el envío de notificaciones por correo. Ambos proveedores
        cumplen con las garantías exigidas por el RGPD para la transferencia y el tratamiento de
        datos.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Sus derechos</h2>
      <p>
        Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y
        portabilidad escribiendo a hola@javimorales.net.
      </p>
    </LegalLayout>
  );
}
