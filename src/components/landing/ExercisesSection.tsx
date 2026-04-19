import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dumbbell, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const ExercisesSection = () => {
  const { lang, t, dir } = useLanguage();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const { data: exercises, isError, error, isPending, refetch } = useQuery({
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
        {isError ? (
          <div className="text-center py-8 space-y-3 max-w-md mx-auto">
            <p className="text-destructive text-sm">{(error as PostgrestError).message}</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              {t("إعادة المحاولة", "Try again")}
            </Button>
          </div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isPending && !isError ? (
            <>
              {[1, 2, 3].map((k) => (
                <Card key={k} className="overflow-hidden border-border/50">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <CardContent className="p-5 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : null}
          {!isPending && exercises && exercises.length > 0 ? (
            exercises.map((item) => (
              <Link key={item.id} to={`/exercises/${item.id}`} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow border-border/50 h-full">
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
                    <p className="text-muted-foreground text-sm mb-3">
                      {lang === "ar" ? item.description_ar : item.description_en}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      {t("عرض التمارين", "View exercises")}
                      <Arrow className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : !isPending && !isError ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 text-primary/40" />
              <p>{t("لا توجد تمارين حالياً", "No exercises available yet")}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
