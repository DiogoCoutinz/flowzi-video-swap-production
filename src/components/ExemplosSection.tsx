import { motion } from "framer-motion";
import { Play } from "lucide-react";

const examples = [
  { id: 1, title: "Dança de Aniversário", color: "from-pink-500/30 to-purple-500/30" },
  { id: 2, title: "TikTok Viral", color: "from-blue-500/30 to-cyan-500/30" },
  { id: 3, title: "Surpresa de Casamento", color: "from-amber-500/30 to-orange-500/30" },
  { id: 4, title: "Festa do Escritório", color: "from-green-500/30 to-emerald-500/30" },
  { id: 5, title: "Formatura", color: "from-violet-500/30 to-indigo-500/30" },
  { id: 6, title: "Diversão de Férias", color: "from-red-500/30 to-rose-500/30" },
];

const ExemplosSection = () => {
  return (
    <section id="exemplos" className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
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
            Exemplos de <span className="gradient-text">Vídeos</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Vê o que outros criaram com Flowzi
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="glass-card overflow-hidden hover-lift gradient-border">
                <div className={`relative aspect-video bg-gradient-to-br ${example.color}`}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                      backgroundSize: '16px 16px',
                    }} />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 glow-primary">
                      <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-center text-sm">{example.title}</h3>
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
