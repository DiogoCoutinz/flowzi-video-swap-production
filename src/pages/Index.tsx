import { useState, lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ExemplosSection from "@/components/ExemplosSection";
import PrecosSection from "@/components/PrecosSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const VideoCreatorModal = lazy(() => import("@/components/VideoCreatorModal"));

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <HeroSection onOpenModal={() => setIsModalOpen(true)} />
      <ExemplosSection />
      <PrecosSection onOpenModal={() => setIsModalOpen(true)} />
      <FAQSection />
      <CTASection onOpenModal={() => setIsModalOpen(true)} />
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
