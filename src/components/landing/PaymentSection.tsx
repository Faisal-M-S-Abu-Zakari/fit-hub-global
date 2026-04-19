import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import bank from "../../../public/Bank.webp";
import palpay from "../../../public/palpay.png";

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-auto p-1.5 rounded-md hover:bg-accent transition-colors"
      title="Copy"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-accent-foreground/40 hover:text-accent-foreground/80" />
      )}
    </button>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-accent/60 border border-sidebar-border/50">
    <div>
      <p className="text-[10px] uppercase tracking-widest text-accent-foreground/40 font-medium mb-0.5">
        {label}
      </p>
      <p className="text-sm font-mono text-accent-foreground">{value}</p>
    </div>
    <CopyButton value={value} />
  </div>
);

export const PaymentSection = () => {
  const { t } = useLanguage();

  return (
    <section id="payment" className="py-20 bg-accent text-accent-foreground">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t("معلومات الدفع", "Payment Information")}
            </h2>
            <p className="text-accent-foreground/50 text-sm">
              {t("يمكنك الدفع عبر الطرق التالية", "You can pay through the following methods")}
            </p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            {/* Bank of Palestine */}
            <div className="bg-sidebar-accent border border-sidebar-border rounded-2xl overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4 border-b border-sidebar-border/60">
                {/* Logo */}
                <div className="w-15 h-20  bg-white flex items-center justify-center flex-shrink-0 p-1.5">
                  <img src={bank} alt="Bank of Palestine" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-semibold text-accent-foreground">
                    {t("بنك فلسطين", "Bank of Palestine")}
                  </p>
                  <p className="text-xs text-accent-foreground/40 mt-0.5">
                    {t("تحويل بنكي", "Bank Transfer")}
                  </p>
                </div>
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 font-medium">
                  {t("متاح", "Active")}
                </span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Field label={t("اسم الحساب", "Account Name")} value={t("فيتنس جيم", "Fitness Gym")} />
                <Field label={t("رقم الحساب", "Account No.")} value="1234-5678-9012" />
                <Field label={t("الفرع", "Branch")} value={t("الفرع الرئيسي", "Main Branch")} />
              </div>
            </div>

            {/* PALPAY */}
            <div className="bg-sidebar-accent border border-sidebar-border rounded-2xl overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4 border-b border-sidebar-border/60">
                {/* Logo */}
                <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center flex-shrink-0 p-1.5">
                  <img src={palpay} alt="PALPAY" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-semibold text-accent-foreground">PALPAY</p>
                  <p className="text-xs text-accent-foreground/40 mt-0.5">
                    {t("محفظة إلكترونية", "Digital Wallet")}
                  </p>
                </div>
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 font-medium">
                  {t("متاح", "Active")}
                </span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label={t("رقم المحفظة", "Wallet Number")} value="059-1234567" />
                <Field label={t("اسم المستلم", "Recipient")} value={t("فيتنس جيم", "Fitness Gym")} />
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-accent-foreground/30 mt-6">
            {t(
              "بعد الدفع، يرجى إرسال إيصال الدفع للتأكيد",
              "After payment, please send your receipt for confirmation"
            )}
          </p>
        </div>
      </div>
    </section>
  );
};