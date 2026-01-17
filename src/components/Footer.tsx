import flowziLogo from "@/assets/flowzi-logo.png";
import { Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <img src={flowziLogo} alt="Flowzi" className="h-7 w-auto" />
              <span className="font-bold gradient-text">Flowzi</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Vídeos personalizados com IA
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Termos de Serviço
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Contacto
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors">
              <Twitter className="w-4 h-4 text-muted-foreground" />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors">
              <Instagram className="w-4 h-4 text-muted-foreground" />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors">
              <Youtube className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>
            Ao usar o Flowzi confirmas que tens direitos sobre as fotos carregadas. 
            Conteúdo gerado por IA. Não para uso ilegal.
          </p>
          <p>© {new Date().getFullYear()} Flowzi. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
