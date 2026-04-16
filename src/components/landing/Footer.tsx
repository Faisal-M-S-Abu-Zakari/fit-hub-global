import { useLanguage } from "@/contexts/LanguageContext";
import { Dumbbell } from "lucide-react";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 border-t border-border/50">
      <div className="container px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Dumbbell className="h-5 w-5 text-primary" />
          <span className="font-bold">{t("فيتنس جيم", "Fitness Gym")}</span>
        </div>
        <p className="text-muted-foreground text-sm">
          {t("جميع الحقوق محفوظة © 2026", "All rights reserved © 2026")}
        </p>
      </div>
    </footer>
  );
};
