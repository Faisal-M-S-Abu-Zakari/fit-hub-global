import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { LandingNav } from "@/components/landing/LandingNav";
import { Footer } from "@/components/landing/Footer";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PostgrestError } from "@supabase/supabase-js";
import { Dumbbell, Loader2 } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

const MemberPortal = () => {
  const { t, lang } = useLanguage();
  const { user, loading, signIn, signOut, isAdmin } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useDocumentMeta(
    t("منطقة العضو | فيتنس جيم", "Member area | Fitness Gym"),
    t("عرض اشتراكك وحالة الدفع.", "View your membership and payment status."),
  );

  const {
    data: member,
    isLoading: loadingMember,
    isError: memberQueryError,
    error: memberError,
    refetch: refetchMember,
  } = useQuery({
    queryKey: ["member-self", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("*").eq("auth_user_id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast({
        title: t("فشل تسجيل الدخول", "Login failed"),
        description: message,
        variant: "destructive",
      });
    }
    setSubmitting(false);
  };

  const title = t("منطقة العضو", "Member area");
  const daysLeft =
    member?.end_date != null ? differenceInDays(parseISO(member.end_date), new Date()) : null;

  return (
    <div className="min-h-screen">
      <LandingNav />
      <main className="container px-4 pt-24 pb-16 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">{title}</h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : !user ? (
          <Card className="bg-card/80 border-border/50">
            <CardHeader>
              <div className="mx-auto w-12 h-12 rounded-full gradient-orange flex items-center justify-center mb-2">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-center text-lg">
                {t("سجّل الدخول لمتابعة اشتراكك", "Sign in to view your membership")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder={t("البريد الإلكتروني", "Email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder={t("كلمة المرور", "Password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full gradient-orange text-primary-foreground" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {t("دخول", "Sign in")}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground text-center mt-4">
                {t(
                  "يتم ربط حسابك بملف العضوية من قبل الإدارة. إذا لم تظهر بياناتك بعد الدخول، تواصل مع النادي.",
                  "Your account must be linked to your gym profile by staff. If you see no data after signing in, contact the gym.",
                )}
              </p>
            </CardContent>
          </Card>
        ) : loadingMember ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : memberQueryError ? (
          <Card className="bg-card/80 border-border/50">
            <CardContent className="pt-6 text-center space-y-3">
              <p className="text-destructive text-sm">{(memberError as PostgrestError).message}</p>
              <Button type="button" variant="outline" onClick={() => refetchMember()}>
                {t("إعادة المحاولة", "Try again")}
              </Button>
            </CardContent>
          </Card>
        ) : !member ? (
          <Card className="bg-card/80 border-border/50">
            <CardContent className="pt-6 space-y-4 text-center">
              <p className="text-muted-foreground text-sm">
                {t(
                  "لا يوجد ملف عضوية مربوط بهذا الحساب بعد. أعطِ الإدارة هذا المعرف لربط حسابك:",
                  "No membership is linked to this account yet. Give this ID to staff to link your profile:",
                )}
              </p>
              <code className="block text-xs bg-muted p-2 rounded-md break-all select-all">{user.id}</code>
              <div className="flex flex-col gap-2">
                {isAdmin ? (
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/admin/dashboard">{t("لوحة التحكم", "Admin dashboard")}</Link>
                  </Button>
                ) : null}
                <Button type="button" variant="ghost" className="w-full" onClick={() => signOut()}>
                  {t("تسجيل الخروج", "Sign out")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card/80 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">{member.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">{t("الهاتف", "Phone")}</span>
                <span className="font-medium">{member.phone}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">{t("نوع الاشتراك", "Plan")}</span>
                <span className="font-medium capitalize">{member.subscription_type}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">{t("من", "Start")}</span>
                <span>{member.start_date}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">{t("حتى", "End")}</span>
                <span>{member.end_date}</span>
              </div>
              {daysLeft !== null ? (
                <p className="text-muted-foreground pt-2 border-t border-border/50">
                  {daysLeft < 0
                    ? t("انتهى الاشتراك", "Subscription ended")
                    : t(`متبقي ${daysLeft} يوم`, `${daysLeft} day(s) left`)}
                </p>
              ) : null}
              <div className="flex justify-between items-center gap-2 pt-2">
                <span className="text-muted-foreground">{t("الدفع", "Payment")}</span>
                <Badge variant={member.payment_status === "paid" ? "default" : "destructive"}>
                  {lang === "ar" && member.payment_status === "paid"
                    ? "مدفوع"
                    : lang === "ar" && member.payment_status === "pending"
                      ? "معلق"
                      : member.payment_status}
                </Badge>
              </div>
              {member.notes ? (
                <p className="text-muted-foreground pt-2 border-t border-border/50 text-xs">{member.notes}</p>
              ) : null}
              <div className="flex flex-col gap-2 pt-4">
                {isAdmin ? (
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/admin/dashboard">{t("لوحة التحكم", "Admin dashboard")}</Link>
                  </Button>
                ) : null}
                <Button type="button" variant="ghost" className="w-full" onClick={() => signOut()}>
                  {t("تسجيل الخروج", "Sign out")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MemberPortal;
