import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import ExamplesGallery from "@/components/ExamplesGallery";
import VideoCreator from "@/components/VideoCreator";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <ExamplesGallery />
      <VideoCreator />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
