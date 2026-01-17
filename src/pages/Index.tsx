import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ExemplosSection from "@/components/ExemplosSection";
import PrecosSection from "@/components/PrecosSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import VideoCreatorModal from "@/components/VideoCreatorModal";

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
      <VideoCreatorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Index;
