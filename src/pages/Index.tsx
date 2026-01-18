import { useState, lazy, Suspense, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const ExemplosSection = lazy(() => import("@/components/ExemplosSection"));
const PrecosSection = lazy(() => import("@/components/PrecosSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const CTASection = lazy(() => import("@/components/CTASection"));
const Footer = lazy(() => import("@/components/Footer"));
const VideoCreatorModal = lazy(() => import("@/components/VideoCreatorModal"));

const SectionSkeleton = () => <div className="min-h-[400px] w-full bg-background/50 animate-pulse" />;

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Auto-open modal if returning from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout_session_id')) {
      setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, isMobile]);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Dynamic Cursor Glow - Only on Desktop */}
      {!isMobile && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-30 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(37, 99, 235, 0.15), transparent 80%)`,
          }}
        />
      )}

      <Header onOpenModal={() => setIsModalOpen(true)} />
      
      <main>
        <HeroSection onOpenModal={() => setIsModalOpen(true)} />
        <Suspense fallback={<SectionSkeleton />}>
          <ExemplosSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <PrecosSection onOpenModal={() => setIsModalOpen(true)} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <FAQSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <CTASection onOpenModal={() => setIsModalOpen(true)} />
        </Suspense>
      </main>

      <Suspense fallback={<div className="h-20" />}>
        <Footer />
      </Suspense>
      
      <Suspense fallback={null}>
        {isModalOpen && (
          <VideoCreatorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </Suspense>
    </div>
  );
};

export default Index;
