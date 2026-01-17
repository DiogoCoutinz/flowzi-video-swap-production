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
    answer: "Entre 5-10 minutos. Recebes um email quando estiver pronto.",
  },
  {
    question: "Que formatos de foto funcionam?",
    answer: "JPG, PNG. Certifica-te que o rosto está claro e bem iluminado.",
  },
  {
    question: "Os meus dados estão seguros?",
    answer: "Sim. Apagamos todas as fotos e vídeos após 24 horas automaticamente.",
  },
  {
    question: "Posso usar qualquer foto?",
    answer: "Deves ter permissão para usar a foto. Não aceitamos fotos de menores sem consentimento.",
  },
  {
    question: "E se não ficar satisfeito?",
    answer: "Contacta-nos em até 24h e reembolsamos sem questões.",
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
