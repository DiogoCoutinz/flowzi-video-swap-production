import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CTASectionProps {
  onOpenModal: () => void;
}

const CTASection = ({ onOpenModal }: CTASectionProps) => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 gradient-cta opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(222.2_47.4%_11.2%/0.4)_100%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
            Cria o Teu Vídeo Agora
          </h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenModal}
            className="inline-flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            Começar - €5
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
