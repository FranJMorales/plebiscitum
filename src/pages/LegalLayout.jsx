import { motion } from 'framer-motion';

export default function LegalLayout({ title, children }) {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[140px] rounded-full mt-24" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-10 glass-panel p-8 md:p-12 rounded-3xl"
      >
        <h1 className="text-4xl font-bold text-white mb-8">{title}</h1>
        <div className="prose prose-invert max-w-none text-smoke-grey/80 space-y-6">{children}</div>
      </motion.div>
    </div>
  );
}
