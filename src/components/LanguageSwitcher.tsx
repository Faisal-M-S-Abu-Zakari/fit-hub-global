import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      className="gap-2 border-primary/30 hover:bg-primary/10"
    >
      <Globe className="h-4 w-4" />
      {lang === "ar" ? "English" : "العربية"}
    </Button>
  );
};
