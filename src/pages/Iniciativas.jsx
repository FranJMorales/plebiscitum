import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';

function Badge({ estado }) {
  const abierta = estado === 'abierta';
  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${
        abierta ? 'bg-turquoise/20 text-turquoise' : 'bg-smoke-grey/10 text-smoke-grey/50'
      }`}
    >
      {abierta ? 'Abierta a voto' : 'Cerrada'}
    </span>
  );
}

export default function Iniciativas() {
  const { session, cargando } = useAuth();
  const [iniciativas, setIniciativas] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('iniciativas')
      .select('id, titulo_original, resumen_simple, departamento, estado, fecha_publicacion, fecha_cierre_votacion')
      .order('fecha_publicacion', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setIniciativas(data);
      });
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Iniciativas del BOE</h1>
      <p className="text-smoke-grey/50 mb-10">
        Cada día revisamos el Boletín Oficial del Estado y traducimos a lenguaje claro las
        normas con impacto directo en la ciudadanía, para que puedas opinar sobre ellas.
      </p>

      {!cargando && !session && (
        <div className="glass-panel rounded-2xl p-5 mb-8 text-sm text-smoke-grey/70">
          Puedes ver las iniciativas sin cuenta, pero necesitas{' '}
          <Link to="/#hero" className="text-turquoise underline underline-offset-2">
            registrarte o iniciar sesión
          </Link>{' '}
          para votar.
        </div>
      )}

      {error && <p className="text-red-400 text-sm">Error al cargar las iniciativas: {error}</p>}

      {iniciativas === null && !error && (
        <p className="text-smoke-grey/40 text-sm">Cargando iniciativas…</p>
      )}

      {iniciativas?.length === 0 && (
        <p className="text-smoke-grey/40 text-sm">
          Todavía no hay iniciativas publicadas. La ingesta diaria del BOE las irá añadiendo
          automáticamente.
        </p>
      )}

      <div className="space-y-4">
        {iniciativas?.map((ini) => (
          <Link
            key={ini.id}
            to={`/iniciativas/${ini.id}`}
            className="block glass-panel glass-border rounded-2xl p-6 hover:border-turquoise/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="font-bold text-lg">{ini.titulo_original}</h2>
              <Badge estado={ini.estado} />
            </div>
            {ini.departamento && (
              <p className="text-xs text-smoke-grey/40 mb-2">{ini.departamento}</p>
            )}
            <p className="text-sm text-smoke-grey/60 line-clamp-3">{ini.resumen_simple}</p>
            <p className="text-xs text-smoke-grey/30 mt-3">
              Votación hasta el {new Date(ini.fecha_cierre_votacion).toLocaleDateString('es-ES')}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
