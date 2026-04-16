import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

export const ExercisesSection = () => {
  const { lang, t } = useLanguage();

  const { data: exercises } = useQuery({
    queryKey: ["content", "exercise"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("type", "exercise")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="exercises" className="py-20 bg-secondary/50">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t("التمارين والبرامج", "Exercises & Programs")}
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          {t("برامج تدريبية متنوعة تناسب جميع المستويات", "Diverse training programs for all fitness levels")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises && exercises.length > 0 ? (
            exercises.map((item) => (
              <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-shadow border-border/50">
                {item.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={lang === "ar" ? item.title_ar : item.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-2">
                    {lang === "ar" ? item.title_ar : item.title_en}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {lang === "ar" ? item.description_ar : item.description_en}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 text-primary/40" />
              <p>{t("لا توجد تمارين حالياً", "No exercises available yet")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
