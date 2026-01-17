import { motion } from "framer-motion";
import flowziLogo from "@/assets/flowzi-logo.png";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-border/30"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src={flowziLogo} alt="Flowzi" className="h-10 w-auto" />
          <span className="text-xl font-bold gradient-text">Flowzi</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#examples" className="text-muted-foreground hover:text-foreground transition-colors">
            Examples
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
        </div>

        <a
          href="#create"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-medium transition-all hover:glow-primary"
        >
          Get Started
        </a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
