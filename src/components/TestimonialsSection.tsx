import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    text: "Incrível! Usei para o aniversário da minha mãe, ela adorou!",
    author: "Maria S.",
  },
  {
    text: "Qualidade top, valeu cada cêntimo. Recomendo!",
    author: "João P.",
  },
  {
    text: "Fiz para o casamento, todos ficaram surpreendidos!",
    author: "Ana R.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative bg-secondary/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-500 text-yellow-500" />
            ))}
          </div>
          <p className="text-xl font-semibold">4.9/5 de 1.200+ utilizadores</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="glass-card p-6"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 mb-4 flex items-center justify-center">
                <span className="text-lg font-bold">{testimonial.author[0]}</span>
              </div>
              <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
              <p className="text-muted-foreground text-sm">- {testimonial.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
