import { motion } from "framer-motion";
import { Camera, Music, Mail } from "lucide-react";

const steps = [
  {
    icon: Camera,
    emoji: "📸",
    title: "1. Carrega a Tua Foto",
    description: "Foto clara do rosto, boa iluminação",
  },
  {
    icon: Music,
    emoji: "💃",
    title: "2. Escolhe a Dança",
    description: "Seleciona de templates virais",
  },
  {
    icon: Mail,
    emoji: "✉️",
    title: "3. Recebe por Email",
    description: "Pronto em 5-10 minutos",
  },
];

const ComoFunciona = () => {
  return (
    <section id="como-funciona" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simples e <span className="gradient-text">Rápido</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-primary/50 to-transparent z-0" />
              )}

              <div className="glass-card p-8 gradient-border hover-lift relative z-10 text-center">
                <div className="text-5xl mb-6">{step.emoji}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;
