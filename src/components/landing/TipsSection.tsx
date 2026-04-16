import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export const TipsSection = () => {
  const { lang, t } = useLanguage();

  const { data: tips } = useQuery({
    queryKey: ["content", "tip"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("type", "tip")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="tips" className="py-20">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t("نصائح صحية", "Health Tips")}
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          {t("نصائح من خبرائنا لتحقيق أفضل النتائج", "Expert tips to achieve the best results")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {tips && tips.length > 0 ? (
            tips.map((item) => (
              <Card key={item.id} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full gradient-orange flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">
                      {lang === "ar" ? item.title_ar : item.title_en}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {lang === "ar" ? item.description_ar : item.description_en}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-primary/40" />
              <p>{t("لا توجد نصائح حالياً", "No tips available yet")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
