import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { validarDniNie, validarTelefonoEspanol } from '../lib/dniValidator';

// Sustituye al componente de registro basado en Firebase (createUserWithEmailAndPassword
// + contraseña aleatoria descartada + setDoc en "waitlist"/"mail").
//
// El registro exige nombre, email, DNI/NIE y teléfono móvil español, para garantizar
// una cuenta por persona real (evita altas masivas/duplicadas). Toda la validación
// fuerte (dígito de control del DNI/NIE, unicidad de DNI y de teléfono) se repite en
// el servidor dentro de la Edge Function "registrar" — lo de aquí es solo para dar
// feedback inmediato al usuario, nunca la única barrera.
//
// La función "registrar" hashea el DNI/NIE (con un pepper que solo vive en Supabase
// Vault, nunca en el cliente) y, si no hay ya una cuenta con ese DNI o ese teléfono,
// dispara signInWithOtp (Magic Link): el usuario nunca gestiona contraseña. Al llegar
// el email, el trigger on_auth_user_created crea su fila en "profiles" automáticamente
// con el nombre, el hash del DNI y el teléfono ya guardados.
export default function WaitlistForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dniNie, setDniNie] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !dniNie || !phone) return;

    setError(null);

    const dniCheck = validarDniNie(dniNie);
    if (!dniCheck.valido) {
      setError(`DNI/NIE no válido: ${dniCheck.motivo}`);
      return;
    }

    const telefonoNormalizado = phone.trim().startsWith('+')
      ? phone.trim()
      : `+34${phone.replace(/\D/g, '')}`;

    if (!validarTelefonoEspanol(telefonoNormalizado)) {
      setError('Introduce un móvil español válido, por ejemplo 612345678.');
      return;
    }

    setLoading(true);

    const { data, error: fnError } = await supabase.functions.invoke('registrar', {
      body: {
        full_name: fullName,
        email: email.trim(),
        dni_nie: dniCheck.normalizado,
        phone: telefonoNormalizado,
      },
    });

    if (fnError || data?.error) {
      const mensaje = data?.error || 'Hubo un error al registrar. Comprueba tu conexión e inténtalo de nuevo.';
      setError(mensaje);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center"
      >
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h4 className="text-lg font-bold text-green-400 mb-2">¡Ya casi estás dentro!</h4>
        <p className="text-sm text-smoke-grey/60 mb-2">
          Te hemos enviado un enlace de acceso a tu correo. Ábrelo para confirmar tu
          registro y entrar en Plebiscitum — no necesitas ninguna contraseña.
        </p>
        <p className="text-sm font-semibold text-smoke-grey/80">
          Revisa tu carpeta de SPAM o correo no deseado si no lo ves en un par de minutos.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="glass-panel p-1 w-full max-w-md mx-auto rounded-3xl p-8 text-left shadow-2xl shadow-midnight-depth"
    >
      <h3 className="text-2xl font-bold mb-2">Únete a la Revolución</h3>
      <p className="text-smoke-grey/50 text-sm mb-8">
        Regístrate para el acceso anticipado y sé parte del cambio.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre y Apellidos"
            className="w-full bg-midnight-depth/50 border border-smoke-grey/10 rounded-xl px-4 py-3 text-smoke-grey focus:outline-none focus:border-turquoise/50 transition-all z-20 relative"
          />
        </div>

        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            className="w-full bg-midnight-depth/50 border border-smoke-grey/10 rounded-xl px-4 py-3 text-smoke-grey focus:outline-none focus:border-turquoise/50 transition-all z-20 relative"
          />
        </div>

        <div>
          <input
            type="text"
            required
            value={dniNie}
            onChange={(e) => setDniNie(e.target.value)}
            placeholder="Tu DNI o NIE (ej. 12345678Z)"
            className="w-full bg-midnight-depth/50 border border-smoke-grey/10 rounded-xl px-4 py-3 text-smoke-grey focus:outline-none focus:border-turquoise/50 transition-all z-20 relative"
          />
          <p className="text-xs text-smoke-grey/40 mt-1 px-1">
            Solo guardamos un hash irreversible de tu DNI/NIE, nunca el número en claro.
          </p>
        </div>

        <div>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Tu móvil (ej. 612345678)"
            className="w-full bg-midnight-depth/50 border border-smoke-grey/10 rounded-xl px-4 py-3 text-smoke-grey focus:outline-none focus:border-turquoise/50 transition-all z-20 relative"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-4 flex items-center justify-center gap-3 relative z-20"
        >
          {loading ? (
            <span className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
          ) : (
            'Enviarme el enlace de acceso'
          )}
        </button>
      </form>
    </motion.div>
  );
}
