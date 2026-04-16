import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ExercisesSection } from "@/components/landing/ExercisesSection";
import { TipsSection } from "@/components/landing/TipsSection";
import { PaymentSection } from "@/components/landing/PaymentSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <HeroSection />
      <ExercisesSection />
      <TipsSection />
      <PaymentSection />
      <Footer />
    </div>
  );
};

export default Index;
