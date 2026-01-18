import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Quanto tempo demora?",
    answer: "Entre 8 a 12 minutos. O nosso sistema processa o vídeo e envia-te automaticamente um email com o link para download.",
  },
  {
    question: "Que formatos funcionam?",
    answer: "Para a fotografia aceitamos JPG, PNG ou WEBP. Para o vídeo o formato deve ser MP4 (máximo de 12 segundos).",
  },
  {
    question: "Os meus dados estão seguros?",
    answer: "Totalmente. Não guardamos as tuas fotos originais. Apenas o resultado final é mantido nos nossos servidores por 15 dias para que possas fazer o download, sendo depois apagado permanentemente.",
  },
  {
    question: "E se não ficar satisfeito?",
    answer: "Garantimos 100% de satisfação. Se o resultado não for o que esperavas, envia um email para flowzi.geral@gmail.com com o vídeo e a tua justificação, e devolvemos 100% do teu dinheiro.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perguntas <span className="gradient-text">Frequentes</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-xl px-6 border-0"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-medium text-sm">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
