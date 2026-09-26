import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const PREGUNTAS = [
  {
    q: '¿Por qué confiar en Plebiscitum?',
    a: 'Nuestro código es open-source, lo que significa que cualquier experto puede auditar cómo procesamos la información y aseguramos los votos.',
  },
  {
    q: '¿Quién mantendrá económicamente todo este sistema?',
    a: 'Plebiscitum operará a través de un modelo de donaciones ciudadanas y subvenciones para proyectos de transparencia democrática. Sin publicidad ni venta de datos.',
  },
  {
    q: '¿Es legalmente vinculante mi voto aquí?',
    a: 'Actualmente canalizamos los votos mediante mecanismos legales como el Derecho de Petición. Aunque el voto individual no es vinculante por ley aún, el volumen agregado tiene un peso institucional masivo.',
  },
  {
    q: '¿La plataforma es privada y segura?',
    a: 'Tu voto se guarda de forma que nadie, ni siquiera el equipo de Plebiscitum, puede ver cómo ha votado una persona concreta: solo se publican los recuentos agregados por iniciativa. Verificamos tu identidad con DNI/NIE y teléfono para que cada persona solo pueda votar una vez.',
  },
];

export default function FAQ() {
  const [abierta, setAbierta] = useState(null);

  return (
    <section id="preguntas-frecuentes" className="py-24 px-6 max-w-3xl mx-auto">
      <h2 className="text-4xl font-black text-center mb-16 underline decoration-turquoise/30 underline-offset-8">
        Preguntas Frecuentes
      </h2>
      <div className="space-y-4">
        {PREGUNTAS.map((item, i) => (
          <div key={item.q} className="glass-panel rounded-2xl overflow-hidden">
            <button
              onClick={() => setAbierta(abierta === i ? null : i)}
              className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-bold text-lg">{item.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-turquoise transition-transform duration-300 ${
                  abierta === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {abierta === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-8 pb-6 text-smoke-grey/60 leading-relaxed border-t border-white/5 pt-4">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
