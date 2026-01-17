import { motion } from "framer-motion";
import { Play } from "lucide-react";

const examples = [
  { 
    id: 1, 
    title: "Shuffle Dance", 
    gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
    pattern: "radial"
  },
  { 
    id: 2, 
    title: "TikTok Viral", 
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    pattern: "diagonal"
  },
  { 
    id: 3, 
    title: "Party Moves", 
    gradient: "from-orange-500 via-pink-500 to-rose-500",
    pattern: "waves"
  },
  { 
    id: 4, 
    title: "Smooth Groove", 
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    pattern: "dots"
  },
];

const ExemplosSection = () => {
  return (
    <section id="exemplos" className="py-16 md:py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Exemplos de <span className="gradient-text">Resultados</span>
          </h2>
        </motion.div>

        {/* Mobile: Horizontal scroll, Desktop: 4 columns */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
          {examples.map((example, index) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group cursor-pointer snap-center flex-shrink-0 w-[200px] md:w-full"
            >
              <div className="relative overflow-hidden rounded-2xl hover-lift">
                {/* 9:16 aspect ratio container */}
                <div className={`relative aspect-[9/16] bg-gradient-to-br ${example.gradient} overflow-hidden`}>
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-30">
                    {example.pattern === "radial" && (
                      <div className="absolute inset-0" style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                      }} />
                    )}
                    {example.pattern === "diagonal" && (
                      <div className="absolute inset-0" style={{
                        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                      }} />
                    )}
                    {example.pattern === "waves" && (
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="rgba(255,255,255,0.15)" />
                        <path d="M0,60 Q25,40 50,60 T100,60 V100 H0 Z" fill="rgba(255,255,255,0.1)" />
                      </svg>
                    )}
                    {example.pattern === "dots" && (
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 2px, transparent 2px)',
                        backgroundSize: '20px 20px',
                      }} />
                    )}
                  </div>

                  {/* Silhouette placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="w-24 h-32 rounded-full bg-white/10 backdrop-blur-sm"
                      animate={{ 
                        y: [0, -5, 0],
                        scale: [1, 1.02, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        delay: index * 0.3 
                      }}
                    />
                  </div>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </motion.div>
                  </div>

                  {/* Bottom gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold text-white text-sm">{example.title}</h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExemplosSection;
