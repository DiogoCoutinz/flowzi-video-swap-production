import { motion } from "framer-motion";
import { Sparkles, Play, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden animated-gradient">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">5,000+ videos created</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transform Any Dance Video{" "}
              <span className="gradient-text">Into Your Own</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              AI-powered face swap in minutes. Upload a photo, choose a dance, 
              get your personalized video.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a
                href="#create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all glow-primary hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                Create Your Video
              </a>
              <a
                href="#examples"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border hover:border-primary/50 text-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:bg-secondary/50"
              >
                <Play className="w-5 h-5" />
                See Examples
              </a>
            </div>
          </motion.div>

          {/* Hero Visual - Before/After Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="glass-card rounded-2xl p-1 gradient-border animate-float">
                <div className="bg-card rounded-xl overflow-hidden">
                  {/* Split Screen Mockup */}
                  <div className="flex">
                    {/* Before */}
                    <div className="flex-1 p-4 border-r border-border/50">
                      <div className="text-xs text-muted-foreground mb-2 text-center">Your Photo</div>
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                          <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center glow-primary animate-pulse-glow">
                        <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>

                    {/* After */}
                    <div className="flex-1 p-4">
                      <div className="text-xs text-muted-foreground mb-2 text-center">Result</div>
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <Play className="w-8 h-8 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="px-4 pb-4 pt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>Processing...</span>
                      <span>87%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "87%" }}
                        transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute -right-4 top-10 glass-card px-4 py-2 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">AI Processing</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
