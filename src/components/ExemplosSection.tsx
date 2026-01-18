import { motion } from "framer-motion";
import { Play, Volume2, VolumeX, Sparkles } from "lucide-react";
import { useState, useRef } from "react";

const examples = [
  { 
    id: 1, 
    title: "Almirante", 
    subtitle: "Exemplo real",
    videoUrl: "/almirante.mp4",
    gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
  },
  { 
    id: 4, 
    title: "Cinemático", 
    subtitle: "Estilo Movie",
    videoUrl: "/videolanding1.mp4",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
  },
  { 
    id: 2, 
    title: "Influencer", 
    subtitle: "Resultado profissional",
    videoUrl: "/InfluencerFinal.mov",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
  },
  { 
    id: 5, 
    title: "Trending", 
    subtitle: "Viral Style",
    videoUrl: "/videolanding2.mov",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
  },
  { 
    id: 3, 
    title: "Cotrim", 
    subtitle: "Qualidade HD",
    videoUrl: "/cotrim.mp4",
    gradient: "from-amber-500 via-orange-500 to-red-500",
  },
];

const VideoCard = ({ example, index }: { example: typeof examples[0]; index: number }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <motion.div
      key={example.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer snap-center flex-shrink-0 w-[280px] md:w-full"
    >
      <motion.div 
        className="relative overflow-hidden rounded-3xl border border-white/5 shadow-2xl"
        whileHover={{ y: -12, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={handlePlayPause}
      >
        <div className="relative aspect-[9/16] bg-black overflow-hidden">
          <video
            ref={videoRef}
            src={example.videoUrl}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loop
            playsInline
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            preload="metadata"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Play/Pause icon */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'opacity-0 scale-50' : 'opacity-100 scale-100'} z-10`}>
            <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
              <Play className="w-7 h-7 text-white ml-1 fill-white" />
            </div>
          </div>

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/60 transition-all z-20 group-hover:scale-110"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
          
          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
            <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${example.gradient} mb-3`} />
            <h3 className="font-black text-white text-xl md:text-2xl mb-1 tracking-tight">{example.title}</h3>
            <p className="text-white/80 text-sm font-medium uppercase tracking-widest">{example.subtitle}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ExemplosSection = () => {
  return (
    <section id="exemplos" className="py-24 md:py-32 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              O Que Podes <span className="gradient-text">Criar</span>
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              Vê alguns dos resultados incríveis que a nossa IA consegue gerar em segundos.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4" />
              Qualidade 4K Ultra HD
            </div>
          </motion.div>
        </div>

        {/* Improved Grid/Scroll Layout */}
        <div className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
          {examples.map((example, index) => (
            <VideoCard key={example.id} example={example} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExemplosSection;
