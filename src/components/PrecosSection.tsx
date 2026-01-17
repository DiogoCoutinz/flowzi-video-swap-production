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
    <section id="precos" className="py-16 md:py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-sm mx-auto"
        >
          <div className="glass-card p-8 gradient-border text-center">
            <p className="text-sm text-muted-foreground mb-2">Paga por Vídeo</p>
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-5xl font-bold">€5</span>
            </div>

            <ul className="space-y-3 mb-8 text-left">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenModal}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-xl font-semibold transition-all glow-primary"
            >
              <Sparkles className="w-5 h-5" />
              Começar Agora
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrecosSection;
