import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Play, ArrowRight } from "lucide-react";
import { useRef, useEffect } from "react";

interface HeroSectionProps {
  onOpenModal: () => void;
}

const HeroSection = ({ onOpenModal }: HeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const rotate1 = useTransform(scrollY, [0, 500], [-6, -12]);
  const rotate2 = useTransform(scrollY, [0, 500], [6, 12]);

  // Preload videos by creating hidden video elements
  useEffect(() => {
    const videosToPreload = [
      "/almirante.mp4",
      "/InfluencerFinal.mov",
      "/cotrim.mp4",
      "/videolanding1.mp4",
      "/videolanding2.mov"
    ];
    
    videosToPreload.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = src;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[95vh] flex items-center justify-center pt-20 pb-12 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-bg">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-accent/25 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[180px]" />
      </div>

      {/* Creative Floating Videos (Desktop only) */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left Side Video */}
        <motion.div 
          style={{ y: y1, rotate: rotate1 }}
          className="absolute left-[-4%] top-[20%] w-[280px] aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 shadow-2xl glass-card p-1"
        >
          <div className="w-full h-full rounded-[22px] overflow-hidden bg-black">
            <video 
              src="/videolanding1.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        </motion.div>

        {/* Right Side Video */}
        <motion.div 
          style={{ y: y2, rotate: rotate2 }}
          className="absolute right-[-4%] top-[15%] w-[300px] aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 shadow-2xl glass-card p-1"
        >
          <div className="w-full h-full rounded-[22px] overflow-hidden bg-black">
            <video 
              src="/videolanding2.mov" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-10 border-white/10 shadow-lg"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold tracking-wide text-foreground">+5.000 VÍDEOS CRIADOS</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1] mb-8 tracking-tight"
          >
            Tu em{" "}
            <span className="relative inline-block">
              <span className="gradient-text drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">Qualquer Vídeo</span>
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute -bottom-4 left-0 w-full h-4"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M2 8C50 4 150 4 198 8"
                  stroke="url(#gradient-hero)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient-hero" x1="0" y1="0" x2="200" y2="0">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </motion.h1>

          {/* Subheadline with animated text */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Envia uma foto tua, carrega qualquer vídeo, e a nossa IA coloca-te lá dentro. 
            <span className="text-white"> Simples assim.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(37, 99, 235, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Sparkles className="w-6 h-6" />
              Criar Vídeo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <a
              href="#exemplos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 border-2 border-white/10 hover:border-primary/50 text-foreground px-10 py-5 rounded-2xl font-bold text-xl transition-all hover:bg-white/5 backdrop-blur-sm shadow-xl"
            >
              <Play className="w-6 h-6" />
              Ver Exemplos
            </a>
          </motion.div>

          {/* Social proof micro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-base text-muted-foreground bg-white/5 py-4 px-8 rounded-full border border-white/5 w-fit mx-auto backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 border-2 border-background shadow-lg"
                  />
                ))}
              </div>
              <span className="font-semibold text-foreground/80">Milhares de criadores</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/10" />
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 font-bold text-foreground">4.9/5</span>
            </div>
          </motion.div>
        </motion.div>
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
