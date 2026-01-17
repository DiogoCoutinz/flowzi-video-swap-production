import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does it take to process my video?",
    answer: "Most videos are processed within 5-10 minutes. Once complete, you'll receive an email notification with a download link that never expires.",
  },
  {
    question: "What photo requirements work best?",
    answer: "We recommend a clear, front-facing photo with good lighting. Avoid sunglasses, hats, or anything covering your face. Higher resolution photos produce better results.",
  },
  {
    question: "Is my data safe and private?",
    answer: "Absolutely. We use bank-level encryption to protect your data. Your photos are processed securely and automatically deleted after 24 hours. We never share your data with third parties.",
  },
  {
    question: "Can I use any photo?",
    answer: "You must have permission to use any photo you upload. Please only use photos of yourself or photos where you have explicit consent from the person pictured.",
  },
  {
    question: "What if I'm not satisfied with the result?",
    answer: "We strive for the best quality, but AI results can vary. If you're not happy with your video, contact our support team within 24 hours and we'll work to make it right or offer a refund.",
  },
  {
    question: "What video formats are supported?",
    answer: "We deliver videos in MP4 format, which is compatible with virtually all devices and social media platforms including TikTok, Instagram, Facebook, and WhatsApp.",
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
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about Flowzi
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-xl px-6 border-0 gradient-border"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
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
