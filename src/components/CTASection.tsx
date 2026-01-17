import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CTASectionProps {
  onOpenModal: () => void;
}

const CTASection = ({ onOpenModal }: CTASectionProps) => {
  return (
    <section className="py-24 md:py-40 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[#0a0f1c]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)]" />
      
      {/* Animated Lines or Sparkles Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto glass-card p-12 md:p-20 border-white/5 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Internal Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-[80px]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-white tracking-tight">
              Pronto para te veres em <br />
              <span className="gradient-text">Qualquer Vídeo?</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Junta-te a milhares de criadores e começa a criar vídeos virais hoje mesmo.
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenModal}
              className="inline-flex items-center gap-4 bg-white text-black hover:bg-white/90 px-12 py-6 rounded-2xl font-black text-2xl transition-all shadow-2xl group"
            >
              <Sparkles className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
              Criar o Meu Vídeo
            </motion.button>
            
            <p className="mt-8 text-sm font-bold text-muted-foreground uppercase tracking-[0.3em]">
              Resultado em menos de 5 minutos
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
