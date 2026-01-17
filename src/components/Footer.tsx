import flowziLogo from "@/assets/flowzi-logo.png";
import { Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <img src={flowziLogo} alt="Flowzi" className="h-8 w-auto" />
              <span className="text-lg font-bold gradient-text">Flowzi</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered face swap videos
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            >
              <Twitter className="w-5 h-5 text-muted-foreground" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            >
              <Instagram className="w-5 h-5 text-muted-foreground" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            >
              <Youtube className="w-5 h-5 text-muted-foreground" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Flowzi. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
