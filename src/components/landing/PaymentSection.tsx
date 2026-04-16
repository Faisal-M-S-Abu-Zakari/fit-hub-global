import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Smartphone } from "lucide-react";

export const PaymentSection = () => {
  const { t } = useLanguage();

  return (
    <section id="payment" className="py-20 bg-accent text-accent-foreground">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t("معلومات الدفع", "Payment Information")}
        </h2>
        <p className="text-accent-foreground/70 text-center mb-12 max-w-xl mx-auto">
          {t("يمكنك الدفع عبر الطرق التالية", "You can pay through the following methods")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="bg-sidebar-accent border-sidebar-border">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-lg gradient-orange flex items-center justify-center mb-3">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-accent-foreground">
                {t("بنك فلسطين", "Bank of Palestine")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-accent-foreground/80 text-sm">
              <p>{t("اسم الحساب: فيتنس جيم", "Account Name: Fitness Gym")}</p>
              <p>{t("رقم الحساب: 1234-5678-9012", "Account Number: 1234-5678-9012")}</p>
              <p>{t("فرع: الفرع الرئيسي", "Branch: Main Branch")}</p>
            </CardContent>
          </Card>

          <Card className="bg-sidebar-accent border-sidebar-border">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-lg gradient-orange flex items-center justify-center mb-3">
                <Smartphone className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-accent-foreground">PALPAY</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-accent-foreground/80 text-sm">
              <p>{t("رقم المحفظة: 059-1234567", "Wallet Number: 059-1234567")}</p>
              <p>{t("اسم المستلم: فيتنس جيم", "Recipient: Fitness Gym")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
