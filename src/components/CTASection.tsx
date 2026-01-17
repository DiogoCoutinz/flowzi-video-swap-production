import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface CTASectionProps {
  onOpenModal: () => void;
}

const CTASection = ({ onOpenModal }: CTASectionProps) => {
  return (
    <section className="py-24 relative overflow-hidden">
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Pronto para Criar o Teu Vídeo?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Junta-te a milhares de pessoas que já criaram vídeos incríveis
          </p>

          <button
            onClick={onOpenModal}
            className="inline-flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
          >
            Começar Agora - Apenas €5
          </button>

          <p className="mt-6 text-white/70 text-sm flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Oferta de lançamento: €5 (preço normal €9)
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
