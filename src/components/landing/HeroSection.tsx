import { useLanguage } from "@/contexts/LanguageContext";
import heroImg from "@/assets/gym-hero.jpg";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      />
      <div className="absolute inset-0 gradient-hero opacity-80" />
      <div className="relative z-10 container text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-accent-foreground mb-6 animate-fade-in-up">
          {t("حوّل جسمك", "Transform Your Body")}
          <br />
          <span className="text-gradient-orange">
            {t("غيّر حياتك", "Change Your Life")}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-accent-foreground/70 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {t(
            "انضم إلى أفضل صالة رياضية في فلسطين. مدربين محترفين، أجهزة حديثة، وبيئة تحفيزية.",
            "Join the best gym in Palestine. Professional trainers, modern equipment, and a motivating environment."
          )}
        </p>
        <Button
          size="lg"
          className="gradient-orange text-primary-foreground font-bold px-8 py-6 text-lg rounded-full animate-fade-in-up hover:opacity-90 transition-opacity"
          style={{ animationDelay: "0.4s" }}
          onClick={() => document.getElementById("payment")?.scrollIntoView({ behavior: "smooth" })}
        >
          {t("اشترك الآن", "Join Now")}
        </Button>
      </div>
    </section>
  );
};
