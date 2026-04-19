import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ExercisesSection } from "@/components/landing/ExercisesSection";
import { TipsSection } from "@/components/landing/TipsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { PaymentSection } from "@/components/landing/PaymentSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const Index = () => {
  const { t } = useLanguage();
  useDocumentMeta(
    t("فيتنس جيم | برامج تدريبية واشتراكات", "Fitness Gym | Training programs & memberships"),
    t(
      "اكتشف برامج التمارين، الأسعار، طرق الدفع، وتواصل معنا.",
      "Explore workout programs, pricing, payment options, and get in touch.",
    ),
  );

  return (
    <div className="min-h-screen">
      <LandingNav />
      <HeroSection />
      <ExercisesSection />
      <TipsSection />
      <PricingSection />
      <PaymentSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
