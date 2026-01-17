import { useState, lazy, Suspense, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ExemplosSection from "@/components/ExemplosSection";
import PrecosSection from "@/components/PrecosSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { motion, useSpring, useMotionValue } from "framer-motion";

const VideoCreatorModal = lazy(() => import("@/components/VideoCreatorModal"));

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Dynamic Cursor Glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(37, 99, 235, 0.15), transparent 80%)`,
        }}
      />

      <Header onOpenModal={() => setIsModalOpen(true)} />
      
      <main>
        <HeroSection onOpenModal={() => setIsModalOpen(true)} />
        <ExemplosSection />
        <PrecosSection onOpenModal={() => setIsModalOpen(true)} />
        <FAQSection />
        <CTASection onOpenModal={() => setIsModalOpen(true)} />
      </main>

      <Footer />
      
      <Suspense fallback={null}>
        {isModalOpen && (
          <VideoCreatorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </Suspense>
    </div>
  );
};

export default Index;
