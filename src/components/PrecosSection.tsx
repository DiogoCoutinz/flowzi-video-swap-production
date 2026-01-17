import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface PrecosSectionProps {
  onOpenModal: () => void;
}

const features = [
  "Qualidade HD",
  "Sem marca de água",
  "Processamento rápido",
  "Entrega por email",
];

const PrecosSection = ({ onOpenModal }: PrecosSectionProps) => {
  return (
    <section id="precos" className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Preço <span className="gradient-text">Simples</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-sm mx-auto"
        >
          <div className="glass-card p-8 gradient-border text-center">
            <h3 className="text-lg font-semibold mb-2">Paga por Vídeo</h3>
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-5xl font-bold gradient-text">€5</span>
              <span className="text-muted-foreground">por vídeo</span>
            </div>

            <ul className="space-y-3 mb-8 text-left">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onOpenModal}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-xl font-semibold transition-all glow-primary hover:scale-[1.02]"
            >
              Começar Agora
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrecosSection;
