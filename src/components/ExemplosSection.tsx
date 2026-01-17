import { motion } from "framer-motion";
import { Play, Volume2, VolumeX } from "lucide-react";
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
    id: 2, 
    title: "Influencer", 
    subtitle: "Resultado profissional",
    videoUrl: "/InfluencerFinal.mov",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group cursor-pointer snap-center flex-shrink-0 w-[240px] md:w-full"
    >
      <motion.div 
        className="relative overflow-hidden rounded-2xl"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        onClick={handlePlayPause}
      >
        <div className="relative aspect-[9/16] bg-black overflow-hidden">
          <video
            ref={videoRef}
            src={example.videoUrl}
            className="w-full h-full object-cover"
            loop
            playsInline
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            preload="metadata"
          />

          {/* Play/Pause overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} bg-black/30`}>
            <motion.div 
              className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/40"
              whileHover={{ scale: 1.1 }}
            >
              <Play className="w-6 h-6 text-white ml-1" fill="white" />
            </motion.div>
          </div>

          {/* Mute button */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-black/70 transition-colors z-10"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
          
          {/* Title & subtitle */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
            <h3 className="font-bold text-white text-base mb-0.5">{example.title}</h3>
            <p className="text-white/70 text-xs">{example.subtitle}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ExemplosSection = () => {
  return (
    <section id="exemplos" className="py-16 md:py-20 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold">
            O Que Podes <span className="gradient-text">Criar</span>
          </h2>
        </motion.div>

        {/* Mobile: Horizontal scroll, Desktop: 3 columns */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
          {examples.map((example, index) => (
            <VideoCard key={example.id} example={example} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExemplosSection;
