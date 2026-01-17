import { motion } from "framer-motion";

const benefits = [
  { emoji: "⚡", title: "Rápido", description: "Pronto em 5 minutos" },
  { emoji: "🔒", title: "Seguro", description: "Dados apagados após 24h" },
  { emoji: "✨", title: "Qualidade HD", description: "Sem desfoque, nítido" },
  { emoji: "💰", title: "Justo", description: "Apenas €5, sem subscrição" },
];

const BeneficiosSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Porquê Escolher <span className="gradient-text">Flowzi?</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-card p-6 text-center hover-lift"
            >
              <div className="text-4xl mb-4">{benefit.emoji}</div>
              <h3 className="font-semibold mb-1">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeneficiosSection;
