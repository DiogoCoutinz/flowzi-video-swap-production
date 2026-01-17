import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const features = [
  "HD Quality Video",
  "No Watermark",
  "Fast Processing (5-10 min)",
  "Email Delivery",
  "Download Forever",
  "Share Anywhere",
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
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
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            No subscriptions. No hidden fees. Just pay per video.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="glass-card rounded-2xl p-8 gradient-border relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-4 right-4">
              <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Most Popular
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Pay Per Video</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold gradient-text">€5</span>
                <span className="text-muted-foreground">/ video</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="#create"
              className="block w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-xl font-semibold text-lg transition-all glow-primary hover:scale-[1.02]"
            >
              Get Started Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
