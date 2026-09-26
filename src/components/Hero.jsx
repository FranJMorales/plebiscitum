import { motion } from 'framer-motion';
import WaitlistForm from './WaitlistForm';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden mesh-gradient">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 blur-[140px] rounded-full animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-4xl mx-auto"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-turquoise/20 text-turquoise text-xs font-bold uppercase tracking-widest mb-8">
          <span className="w-2 h-2 rounded-full bg-turquoise animate-pulse" />
          Democracia Real
        </span>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
          El poder del pueblo. Tu Voz en el Gobierno para <br />
          <span className="gradient-text">todas las decisiones</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-turquoise/10 flex items-center justify-center">
              <span className="text-xl">📖</span>
            </div>
            <span className="font-semibold text-smoke-grey/80">Lectura Simplificada</span>
          </div>
          <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-electric-blue/10 flex items-center justify-center">
              <span className="text-xl">⚡</span>
            </div>
            <span className="font-semibold text-smoke-grey/80">Impacto Directo</span>
          </div>
        </div>

        <WaitlistForm />
      </motion.div>
    </section>
  );
}
