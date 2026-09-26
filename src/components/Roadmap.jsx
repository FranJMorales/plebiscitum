import { motion } from 'framer-motion';

const FASES = [
  {
    phase: 'Fase 1',
    title: 'Pre-Registro',
    description:
      'Construcción del motor de monitoreo del BOE y la IA de simplificación legal. Captación de ciudadanos y mecenas.',
    active: true,
  },
  {
    phase: 'Fase 2',
    title: 'Lanzamiento',
    description: 'Apertura a todos los usuarios e inicio de funciones oficiales de votación.',
    active: false,
  },
  {
    phase: 'Fase 3',
    title: 'Escalabilidad',
    description: 'Integración de nuevas funciones, mejoras de UI y expansión de servidores.',
    active: false,
  },
  {
    phase: 'Fase 4',
    title: 'Soberanía Digital',
    description: 'Migración a infraestructura propia, desarrollo de IA local y privada.',
    active: false,
  },
  {
    phase: 'Fase 5',
    title: 'Expansión Ciudadana',
    description: 'Ampliación del alcance a un público mayor, desde jóvenes a personas de avanzada edad.',
    active: false,
  },
  {
    phase: 'Fase 6',
    title: 'Impacto Real',
    description: 'Toma de decisiones en estrecha colaboración con la población y reducción de gasto público.',
    active: false,
  },
];

export default function Roadmap() {
  return (
    <section id="hoja-de-ruta" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black mb-4">Hoja de ruta</h2>
        <p className="text-smoke-grey/50">Nuestro camino hacia una democracia más directa y tecnológica.</p>
      </div>

      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-smoke-grey/10" />
        <div className="space-y-12 relative">
          {FASES.map((f, i) => (
            <motion.div
              key={f.phase}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="hidden md:block w-1/2" />
              <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-midnight-depth border-2 border-turquoise transform -translate-x-1/2 z-10">
                {f.active && <div className="absolute inset-0 rounded-full bg-turquoise animate-ping" />}
              </div>
              <div className="w-full md:w-1/2">
                <div
                  className={`glass-panel p-8 rounded-3xl group transition-all duration-300 ${
                    f.active ? 'border-turquoise/40 shadow-lg shadow-turquoise/5' : 'opacity-40 hover:opacity-100'
                  }`}
                >
                  <span
                    className={`text-xs font-bold uppercase tracking-widest mb-2 block ${
                      f.active ? 'text-turquoise' : 'text-smoke-grey/50'
                    }`}
                  >
                    {f.phase}
                  </span>
                  <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                  <p className="text-smoke-grey/60 text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
