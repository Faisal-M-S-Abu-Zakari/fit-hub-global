import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Dumbbell, Mail, Phone } from "lucide-react";

export const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-8 py-12 border-t border-border/50 overflow-hidden">
      <div className="-top-20 left-1/2 absolute bg-primary/15 blur-3xl rounded-full w-64 h-64 -translate-x-1/2 pointer-events-none" />
      <div className="relative container px-4">
        <div className="gap-8 grid grid-cols-1 md:grid-cols-3 text-center md:text-start">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <Dumbbell className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">{t("فيتنس جيم", "Fitness Gym")}</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {t(
                "نساعدك تبني جسم أقوى ونمط حياة صحي بخطط تدريب حديثة.",
                "Build a stronger body and a healthier lifestyle with modern training plans."
              )}
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">{t("روابط سريعة", "Quick Links")}</h4>
            <div className="space-y-2 text-sm">
              <a href="#exercises" className="block text-muted-foreground hover:text-primary transition-colors">{t("التمارين", "Exercises")}</a>
              <a href="#tips" className="block text-muted-foreground hover:text-primary transition-colors">{t("النصائح", "Tips")}</a>
              <a href="#payment" className="block text-muted-foreground hover:text-primary transition-colors">{t("الاشتراك", "Membership")}</a>
              <a href="#contact" className="block text-muted-foreground hover:text-primary transition-colors">{t("تواصل معنا", "Contact")}</a>
              <Link to="/member" className="block text-muted-foreground hover:text-primary transition-colors">
                {t("منطقة العضو", "Member area")}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">{t("تواصل وسوشيال", "Contact & Social")}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center justify-center md:justify-start gap-2"><Mail className="w-4 h-4 text-primary" />fitnes-Gym@gmail.com</p>
              <p className="flex items-center justify-center md:justify-start gap-2"><Phone className="w-4 h-4 text-primary" /> +970 59 000 0000</p>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex justify-center items-center bg-card/80 hover:bg-primary/10 border border-border hover:border-primary/40 rounded-full w-10 h-10 text-muted-foreground hover:text-primary transition-all hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5Zm8.88 1.62a1.12 1.12 0 1 1 0 2.25 1.12 1.12 0 0 1 0-2.25ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex justify-center items-center bg-card/80 hover:bg-primary/10 border border-border hover:border-primary/40 rounded-full w-10 h-10 text-muted-foreground hover:text-primary transition-all hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d="M13.5 22v-8h2.8l.42-3.25H13.5V8.68c0-.94.26-1.58 1.6-1.58h1.71V4.2A23.4 23.4 0 0 0 14.3 4C11.82 4 10.1 5.52 10.1 8.32v2.43H7.3V14h2.8v8h3.4Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm">
            {t(`جميع الحقوق محفوظة © ${year}`, `All rights reserved © ${year}`)}
          </p>
        </div>
      </div>
    </footer>
  );
};
