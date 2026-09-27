import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';

const OPCIONES = [
  { valor: 'a_favor', etiqueta: 'A favor', clase: 'bg-green-500/10 border-green-500/30 text-green-400' },
  { valor: 'en_contra', etiqueta: 'En contra', clase: 'bg-red-500/10 border-red-500/30 text-red-400' },
  { valor: 'abstencion', etiqueta: 'Abstención', clase: 'bg-smoke-grey/10 border-smoke-grey/30 text-smoke-grey/70' },
];

export default function IniciativaDetalle() {
  const { id } = useParams();
  const { session } = useAuth();
  const [iniciativa, setIniciativa] = useState(null);
  const [resultados, setResultados] = useState(null);
  const [miVoto, setMiVoto] = useState(undefined); // undefined = sin comprobar, null = no ha votado
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const cargarResultados = async () => {
    const { data } = await supabase
      .from('resultados_votacion')
      .select('*')
      .eq('iniciativa_id', id)
      .maybeSingle();
    setResultados(data ?? { votos_a_favor: 0, votos_en_contra: 0, votos_abstencion: 0, total_votos: 0 });
  };

  useEffect(() => {
    supabase
      .from('iniciativas')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setIniciativa(data);
      });

    cargarResultados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!session) {
      setMiVoto(null);
      return;
    }
    supabase
      .from('votos')
      .select('voto')
      .eq('iniciativa_id', id)
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setMiVoto(data?.voto ?? null));
  }, [id, session]);

  const votar = async (opcion) => {
    if (!session || enviando) return;
    setEnviando(true);
    setError(null);

    const { error: err } = await supabase.from('votos').insert({
      iniciativa_id: id,
      user_id: session.user.id,
      voto: opcion,
    });

    if (err) {
      if (err.code === '23505') {
        setError('Ya has votado en esta iniciativa.');
        setMiVoto(opcion);
      } else {
        setError('No se pudo registrar tu voto. Inténtalo de nuevo.');
      }
      setEnviando(false);
      return;
    }

    setMiVoto(opcion);
    await cargarResultados();
    setEnviando(false);
  };

  if (error && !iniciativa) {
    return <main className="min-h-screen pt-32 px-6 max-w-3xl mx-auto text-red-400">{error}</main>;
  }

  if (!iniciativa) {
    return <main className="min-h-screen pt-32 px-6 max-w-3xl mx-auto text-smoke-grey/40">Cargando…</main>;
  }

  const cerrada = iniciativa.estado !== 'abierta';
  const total = resultados?.total_votos || 0;

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-3xl mx-auto">
      <Link to="/iniciativas" className="text-xs text-smoke-grey/40 hover:text-turquoise mb-6 inline-block">
        ← Todas las iniciativas
      </Link>

      <h1 className="text-3xl font-bold mb-2">{iniciativa.titulo_original}</h1>
      {iniciativa.departamento && (
        <p className="text-sm text-smoke-grey/40 mb-6">{iniciativa.departamento}</p>
      )}

      <p className="text-smoke-grey/70 leading-relaxed mb-6">{iniciativa.resumen_simple}</p>

      <a
        href={iniciativa.enlace_boe}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-turquoise underline underline-offset-2"
      >
        Ver la publicación original en el BOE →
      </a>

      <div className="glass-panel glass-border rounded-2xl p-6 mt-10">
        <h2 className="font-bold mb-4">
          {cerrada ? 'Resultado final' : 'Vota esta iniciativa'}
        </h2>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {!session && !cerrada && (
          <p className="text-sm text-smoke-grey/50 mb-4">
            Necesitas <Link to="/#hero" className="text-turquoise underline underline-offset-2">registrarte o iniciar sesión</Link> para votar.
          </p>
        )}

        {session && !cerrada && miVoto === null && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {OPCIONES.map((op) => (
              <button
                key={op.valor}
                disabled={enviando}
                onClick={() => votar(op.valor)}
                className={`py-3 rounded-xl border font-semibold text-sm transition-transform hover:scale-105 disabled:opacity-50 ${op.clase}`}
              >
                {op.etiqueta}
              </button>
            ))}
          </div>
        )}

        {session && miVoto && (
          <p className="text-sm text-turquoise mb-6">
            Ya has votado: <strong>{OPCIONES.find((o) => o.valor === miVoto)?.etiqueta}</strong>
          </p>
        )}

        <div className="space-y-2">
          {OPCIONES.map((op) => {
            const valorClave = { a_favor: 'votos_a_favor', en_contra: 'votos_en_contra', abstencion: 'votos_abstencion' }[op.valor];
            const votosOpcion = resultados?.[valorClave] || 0;
            const pct = total > 0 ? Math.round((votosOpcion / total) * 100) : 0;
            return (
              <div key={op.valor}>
                <div className="flex justify-between text-xs text-smoke-grey/50 mb-1">
                  <span>{op.etiqueta}</span>
                  <span>{votosOpcion} ({pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-smoke-grey/10 overflow-hidden">
                  <div className="h-full bg-turquoise/70" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-smoke-grey/30 mt-4">{total} voto(s) en total.</p>
      </div>
    </main>
  );
}
