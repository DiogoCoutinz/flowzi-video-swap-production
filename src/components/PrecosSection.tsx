import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

interface PrecosSectionProps {
  onOpenModal: () => void;
}

const features = [
  "Qualidade HD",
  "Sem marca de água",
  "Pronto em minutos",
  "Entrega por email",
];

const PrecosSection = ({ onOpenModal }: PrecosSectionProps) => {
  return (
    <section id="precos" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative glass-card p-10 md:p-12 border-white/10 text-center rounded-[1.8rem] shadow-2xl">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-xl">
                Mais Popular
              </div>

              <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Pack Único</p>
              <div className="flex items-baseline justify-center gap-1 mb-8">
                <span className="text-7xl font-black tracking-tighter drop-shadow-2xl">€5</span>
                <span className="text-muted-foreground font-semibold">/vídeo</span>
              </div>

              <ul className="space-y-4 mb-10 text-left border-y border-white/5 py-8">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-4 text-base font-medium">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                      <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                    </div>
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenModal}
                className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 rounded-2xl font-black text-xl transition-all shadow-xl group"
              >
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Criar Agora
              </motion.button>
              
              <p className="mt-6 text-sm text-muted-foreground font-medium">
                Paga apenas o que usas. Sem subscrições.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrecosSection;
