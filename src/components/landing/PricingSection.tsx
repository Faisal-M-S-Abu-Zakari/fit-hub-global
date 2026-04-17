import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Star, Zap } from "lucide-react";

export const PricingSection = () => {
  const { t, lang } = useLanguage();

  const plans = [
    {
      icon: Zap,
      name_ar: "شهري",
      name_en: "Monthly",
      price: "150",
      currency_ar: "₪",
      currency_en: "₪",
      period_ar: "/ شهر",
      period_en: "/ month",
      featured: false,
      features: [
        { ar: "وصول كامل للنادي", en: "Full gym access" },
        { ar: "جميع الأجهزة الرياضية", en: "All equipment" },
        { ar: "خزانة شخصية", en: "Personal locker" },
      ],
    },
    {
      icon: Crown,
      name_ar: "ربع سنوي",
      name_en: "Quarterly",
      price: "400",
      currency_ar: "₪",
      currency_en: "₪",
      period_ar: "/ 3 أشهر",
      period_en: "/ 3 months",
      featured: true,
      features: [
        { ar: "كل مزايا الباقة الشهرية", en: "All Monthly features" },
        { ar: "جلستان مع مدرب شخصي", en: "2 personal trainer sessions" },
        { ar: "برنامج تغذية مخصص", en: "Custom nutrition plan" },
        { ar: "خصم 10% على المكملات", en: "10% off supplements" },
      ],
    },
    {
      icon: Star,
      name_ar: "سنوي",
      name_en: "Yearly",
      price: "1400",
      currency_ar: "₪",
      currency_en: "₪",
      period_ar: "/ سنة",
      period_en: "/ year",
      featured: false,
      features: [
        { ar: "كل مزايا الباقة الربع سنوية", en: "All Quarterly features" },
        { ar: "تدريب شخصي غير محدود", en: "Unlimited personal training" },
        { ar: "وصول لجميع الفروع", en: "Access to all branches" },
        { ar: "هدية ترحيبية", en: "Welcome gift" },
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-secondary/50">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t("باقات الاشتراك", "Membership Plans")}
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          {t("اختر الباقة المناسبة لأهدافك وابدأ رحلتك اليوم", "Choose the plan that fits your goals and start your journey today")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            return (
              <Card
                key={idx}
                className={`relative border-2 transition-all hover:scale-[1.02] ${
                  plan.featured
                    ? "border-primary shadow-lg shadow-primary/20"
                    : "border-border/50 hover:border-primary/30"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-orange text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    {t("الأكثر شعبية", "Most Popular")}
                  </div>
                )}
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${plan.featured ? "gradient-orange" : "bg-primary/10"}`}>
                    <Icon className={`h-6 w-6 ${plan.featured ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {lang === "ar" ? plan.name_ar : plan.name_en}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-lg text-muted-foreground">
                      {lang === "ar" ? plan.currency_ar : plan.currency_en}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {lang === "ar" ? plan.period_ar : plan.period_en}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{lang === "ar" ? f.ar : f.en}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.featured ? "gradient-orange text-primary-foreground" : ""}`}
                    variant={plan.featured ? "default" : "outline"}
                    onClick={() => document.getElementById("payment")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    {t("اشترك الآن", "Subscribe Now")}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
