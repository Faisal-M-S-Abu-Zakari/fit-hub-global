import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";

export const LandingNav = () => {
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-accent/90 backdrop-blur-md border-b border-border/10">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <Dumbbell className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-accent-foreground">
            {t("فيتنس جيم", "Fitness Gym")}
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <a href="#exercises" className="text-sm text-accent-foreground/80 hover:text-primary transition-colors hidden sm:block">
            {t("التمارين", "Exercises")}
          </a>
          <a href="#tips" className="text-sm text-accent-foreground/80 hover:text-primary transition-colors hidden sm:block">
            {t("النصائح", "Tips")}
          </a>
          <a href="#payment" className="text-sm text-accent-foreground/80 hover:text-primary transition-colors hidden sm:block">
            {t("الدفع", "Payment")}
          </a>
          <a href="#contact" className="text-sm text-accent-foreground/80 hover:text-primary transition-colors hidden sm:block">
            {t("تواصل", "Contact")}
          </a>
          <LanguageSwitcher />
          <Link to="/admin" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            {t("لوحة التحكم", "Admin")}
          </Link>
        </div>
      </div>
    </nav>
  );
};
