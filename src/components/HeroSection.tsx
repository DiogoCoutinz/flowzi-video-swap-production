import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Play, Clock, Shield, Check, Star } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface HeroSectionProps {
  onOpenModal: () => void;
}

const HeroSection = ({ onOpenModal }: HeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoLeftRef = useRef<HTMLVideoElement>(null);
  const videoRightRef = useRef<HTMLVideoElement>(null);

  const handleOpenModal = () => {
    trackEvent('open_modal_hero');
    onOpenModal();
  };

  const handleViewExamples = () => {
    trackEvent('view_examples_hero');
    document.getElementById('exemplos')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotateLeft = useTransform(scrollYProgress, [0, 1], [-6, -12]);
  const rotateRight = useTransform(scrollYProgress, [0, 1], [6, 12]);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Delay video loading to prioritize landing page content
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Floating Videos */}
          {isLoaded && (
            <>
              <motion.div 
                style={{ y: yLeft, rotate: rotateLeft }}
                className="absolute -left-4 md:-left-20 top-20 w-32 md:w-64 aspect-[9/16] rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl hidden lg:block opacity-70"
              >
                <video 
                  ref={videoLeftRef}
                  src="/cotrim.mp4" 
                  className="w-full h-full object-cover" 
                  muted 
                  loop 
                  playsInline
                  preload="none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>

              <motion.div 
                style={{ y: yRight, rotate: rotateRight }}
                className="absolute -right-4 md:-right-20 top-40 w-32 md:w-64 aspect-[9/16] rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl hidden lg:block opacity-70"
              >
                <video 
                  ref={videoRightRef}
                  src="/videolanding2.mov" 
                  className="w-full h-full object-cover" 
                  muted 
                  loop 
                  playsInline
                  preload="none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs md:text-sm font-bold tracking-wide uppercase text-foreground/80">+5.000 Vídeos Criados</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
              Tu em <br />
              <span className="relative">
                Qualquer Vídeo
                <motion.svg 
                  viewBox="0 0 300 20" 
                  className="absolute -bottom-2 left-0 w-full h-3 text-primary/60"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <path d="M5 15 Q 150 5 295 15" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </motion.svg>
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Envia uma foto tua, carrega qualquer vídeo, e a nossa IA coloca-te lá dentro. <span className="text-white">Simples assim.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenModal}
                className="group relative inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Sparkles className="w-6 h-6" />
                Criar Vídeo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <button
                onClick={handleViewExamples}
                className="inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-foreground px-10 py-5 rounded-2xl font-bold text-xl transition-all border border-white/10 backdrop-blur-sm"
              >
                <Play className="w-5 h-5 fill-current" />
                Ver Exemplos
              </button>
            </div>

            {/* Trusted By / Social Proof */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 px-8 py-5 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[
                    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                  ].map((src, i) => (
                    <div 
                      key={i} 
                      className="w-12 h-12 rounded-full border-4 border-background shadow-xl overflow-hidden bg-secondary transition-transform hover:scale-110 hover:z-10"
                    >
                      <img src={src} className="w-full h-full object-cover" alt="User" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-base font-black text-foreground leading-none">+5.000 criadores</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1.5 font-bold opacity-60">Usam o Flowzi</span>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <div className="flex items-center gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]" />
                  ))}
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-base font-black text-foreground leading-none">4.9/5</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1.5 font-bold opacity-60">Avaliação média</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
