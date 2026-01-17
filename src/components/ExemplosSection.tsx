import { motion } from "framer-motion";
import { Play } from "lucide-react";

const examples = [
  { 
    id: 1, 
    title: "Trend Viral", 
    subtitle: "Aparece no próximo hit",
    gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
    emoji: "🔥"
  },
  { 
    id: 2, 
    title: "Meme Épico", 
    subtitle: "Tu és o protagonista",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    emoji: "😂"
  },
  { 
    id: 3, 
    title: "Cena de Filme", 
    subtitle: "Hollywood calling",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    emoji: "🎬"
  },
  { 
    id: 4, 
    title: "Surpresa", 
    subtitle: "Faz alguém sorrir",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    emoji: "🎁"
  },
];

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

        {/* Mobile: Horizontal scroll, Desktop: 4 columns */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
          {examples.map((example, index) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group cursor-pointer snap-center flex-shrink-0 w-[180px] md:w-full"
            >
              <motion.div 
                className="relative overflow-hidden rounded-2xl"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* 9:16 aspect ratio container */}
                <div className={`relative aspect-[9/16] bg-gradient-to-br ${example.gradient} overflow-hidden`}>
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                    animate={{ translateX: ["−100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, delay: index * 0.5 }}
                  />

                  {/* Floating emoji */}
                  <motion.div 
                    className="absolute top-6 right-4 text-3xl"
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      delay: index * 0.2 
                    }}
                  >
                    {example.emoji}
                  </motion.div>

                  {/* Silhouette animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="relative"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        delay: index * 0.3 
                      }}
                    >
                      {/* Person silhouette */}
                      <div className="w-16 h-24 rounded-full bg-white/15 backdrop-blur-sm" />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm" />
                    </motion.div>
                  </div>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div 
                      className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/40"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </motion.div>
                  </div>

                  {/* Bottom gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Title & subtitle */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-white text-base mb-0.5">{example.title}</h3>
                    <p className="text-white/70 text-xs">{example.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExemplosSection;
