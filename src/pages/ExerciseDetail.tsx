import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { LandingNav } from "@/components/landing/LandingNav";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Dumbbell, Repeat, Timer, Loader2 } from "lucide-react";

const ExerciseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t, dir } = useLanguage();

  const {
    data: program,
    isLoading: loadingProgram,
    isError: programQueryError,
    error: programError,
    refetch: refetchProgram,
  } = useQuery({
    queryKey: ["program", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("content").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const {
    data: items,
    isLoading: loadingItems,
    isError: itemsQueryError,
    error: itemsError,
    refetch: refetchItems,
  } = useQuery({
    queryKey: ["exercise-items", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercise_items")
        .select("*")
        .eq("content_id", id!)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!program,
  });

  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const fallbackTitle = t("برنامج تدريبي | فيتنس جيم", "Training program | Fitness Gym");
  const fallbackDesc = t("تفاصيل البرنامج والتمارين.", "Program details and exercises.");
  const programLabel = program ? (lang === "ar" ? program.title_ar : program.title_en) : fallbackTitle;
  const programDesc =
    program != null
      ? (lang === "ar" ? program.description_ar : program.description_en) || fallbackDesc
      : fallbackDesc;
  useDocumentMeta(`${programLabel} | ${t("فيتنس جيم", "Fitness Gym")}`, programDesc ?? undefined);

  if (loadingProgram) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (programQueryError) {
    return (
      <div className="min-h-screen">
        <LandingNav />
        <div className="container px-4 py-20 text-center space-y-4">
          <p className="text-destructive text-sm">{(programError as PostgrestError).message}</p>
          <Button type="button" variant="outline" onClick={() => refetchProgram()}>
            {t("إعادة المحاولة", "Try again")}
          </Button>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen">
        <LandingNav />
        <div className="container px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("التمرين غير موجود", "Program not found")}</h1>
          <Link to="/"><Button variant="outline">{t("العودة للرئيسية", "Back to Home")}</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <LandingNav />
      {/* Hero */}
      <section className="relative pt-28 pb-12 bg-secondary/50">
        <div className="container px-4">
          <Link to="/#exercises">
            <Button variant="ghost" size="sm" className="mb-4">
              <Arrow className="h-4 w-4 mr-2" />
              {t("كل البرامج", "All Programs")}
            </Button>
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {lang === "ar" ? program.title_ar : program.title_en}
              </h1>
              <p className="text-muted-foreground text-lg">
                {lang === "ar" ? program.description_ar : program.description_en}
              </p>
              {items && (
                <div className="flex gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Dumbbell className="h-4 w-4 text-primary" />
                    <span>{items.length} {t("تمرين", "exercises")}</span>
                  </div>
                </div>
              )}
            </div>
            {program.image_url && (
              <div className="rounded-xl overflow-hidden h-64 md:h-80">
                <img src={program.image_url} alt={program.title_en} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Exercises list */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            {t("تفاصيل التمارين", "Exercise Breakdown")}
          </h2>
          {itemsQueryError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 mb-6 text-center text-sm space-y-3">
              <p className="text-destructive">{(itemsError as PostgrestError).message}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => refetchItems()}>
                {t("إعادة المحاولة", "Try again")}
              </Button>
            </div>
          ) : null}
          {loadingItems ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
          ) : items && items.length > 0 ? (
            <div className="space-y-6">
              {items.map((ex, idx) => (
                <Card key={ex.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      {ex.image_url && (
                        <div className="h-56 md:h-full overflow-hidden bg-muted">
                          <img
                            src={ex.image_url}
                            alt={lang === "ar" ? ex.title_ar : ex.title_en}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className={`p-6 ${ex.image_url ? "md:col-span-2" : "md:col-span-3"}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="w-8 h-8 rounded-full gradient-orange text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </span>
                          <h3 className="text-xl font-bold">
                            {lang === "ar" ? ex.title_ar : ex.title_en}
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {lang === "ar" ? ex.description_ar : ex.description_en}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-medium">
                            <Dumbbell className="h-4 w-4" />
                            {ex.sets} {t("جولات", "sets")}
                          </div>
                          <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-medium">
                            <Repeat className="h-4 w-4" />
                            {ex.reps} {t("تكرار", "reps")}
                          </div>
                          <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-medium">
                            <Timer className="h-4 w-4" />
                            {ex.rest_seconds}{t("ث راحة", "s rest")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 text-primary/40" />
              <p>{t("لا توجد تمارين تفصيلية لهذا البرنامج بعد", "No detailed exercises for this program yet")}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExerciseDetail;
