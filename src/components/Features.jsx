import { motion } from 'framer-motion';
import { Radar, BookOpenText, Send, Vote, Landmark, Volume2 } from 'lucide-react';

function FeatureCard({ number, icon: Icon, title, description, className = '', extra }) {
  return (
    <div className={`glass-panel p-8 rounded-3xl group hover:border-turquoise/30 transition-all ${className}`}>
      <span className="text-sm font-black text-turquoise/40">{number}</span>
      <div className="w-14 h-14 rounded-2xl bg-turquoise/10 flex items-center justify-center my-4 group-hover:scale-110 transition-transform">
        <Icon className="w-8 h-8 text-turquoise" />
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-smoke-grey/60 leading-relaxed max-w-md">{description}</p>
      {extra && <div className="mt-6">{extra}</div>}
    </div>
  );
}

export default function Features() {
  return (
    <section id="funciones" className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black mb-4 gradient-text">Cómo funciona Plebiscitum</h2>
        <p className="text-smoke-grey/60 max-w-2xl mx-auto">
          Tecnología al servicio de la transparencia y la participación ciudadana activa.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          number="01"
          icon={Radar}
          title="Monitoreo BOE"
          description="Escaneamos constantemente el Boletín Oficial del Estado para identificar nuevas propuestas y leyes para enviártelas directamente."
          className="lg:col-span-2"
        />
        <FeatureCard
          number="02"
          icon={BookOpenText}
          title="Legibilidad"
          description="Traducimos el complejo lenguaje legal a textos claros y accesibles, con total transparencia."
          extra={
            <div className="flex items-center gap-2 text-turquoise/80 text-sm font-medium">
              <Volume2 className="w-4 h-4" />
              <span>Síntesis de voz incluida</span>
            </div>
          }
        />
        <FeatureCard
          number="03"
          icon={Send}
          title="Entrega Directa"
          description="Enviamos notificaciones personalizadas a través de email, mensajería instantánea o SMS, según tu preferencia."
        />
        <FeatureCard
          number="04"
          icon={Vote}
          title="Voto Digital"
          description="Emite tu opinión de forma segura y verificada a través de nuestra plataforma web."
          className="lg:col-span-2"
        />
        <FeatureCard
          number="05"
          icon={Landmark}
          title="Entrega Oficial"
          description="Agregamos los votos y los presentamos formalmente ante las instituciones gubernamentales mediante sus buzones oficiales."
          className="lg:col-span-3"
        />
      </div>
    </section>
  );
}
