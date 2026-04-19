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
import { Dumbbell, Loader2, QrCode, Calendar, Activity, ChevronRight, Share, MapPin, User as UserIcon } from "lucide-react";
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("صباح الخير", "Good morning");
    if (hour < 18) return t("مساء الخير", "Good afternoon");
    return t("مساء الخير", "Good evening");
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
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/50 text-primary overflow-hidden">
                <UserIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{getGreeting()},</p>
                <h2 className="text-2xl font-bold">{member.name}</h2>
              </div>
            </div>

            {/* Virtual Membership Card */}
            <Card className="bg-gradient-to-br from-primary/80 to-orange-600/80 border-none text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Dumbbell className="h-24 w-24" />
              </div>
              <CardContent className="p-6 relative z-10 flex gap-4 items-center">
                <div className="bg-white/95 p-3 rounded-lg flex-shrink-0 animate-pulse-slow">
                  <QrCode className="h-20 w-20 text-black" />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-white/70 text-xs font-semibold tracking-wider uppercase">{t("بطاقة العضوية", "MEMBERSHIP CARD")}</p>
                    <p className="font-mono text-lg font-bold tracking-widest">{member.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30 capitalize">
                    {member.subscription_type} Plan
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card/80 border-border/50 hover:bg-card transition-colors cursor-pointer group">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <p className="font-medium text-sm">{t("الجدول", "Schedule")}</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 border-border/50 hover:bg-card transition-colors cursor-pointer group">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="h-5 w-5" />
                  </div>
                  <p className="font-medium text-sm">{t("التمارين", "Workouts")}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/80 border-border/50">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-lg">{t("تفاصيل الاشتراك", "Subscription Details")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground block text-xs">{t("من", "Valid from")}</span>
                    <span className="font-medium">{member.start_date}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">{t("حتى", "Valid until")}</span>
                    <span className="font-medium">{member.end_date}</span>
                  </div>
                </div>
                
                {daysLeft !== null ? (
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">{t("الحالة", "Status")}</span>
                    {daysLeft < 0 ? (
                      <Badge variant="destructive">{t("انتهى الاشتراك", "Subscription ended")}</Badge>
                    ) : (
                      <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm">{t(`متبقي ${daysLeft} يوم`, `${daysLeft} day(s) left`)}</Badge>
                    )}
                  </div>
                ) : null}

                <div className="flex justify-between items-center gap-2 pt-4 border-t border-border/50">
                  <span className="text-muted-foreground">{t("حالة الدفع", "Payment Status")}</span>
                  <Badge variant={member.payment_status === "paid" ? "default" : "destructive"}>
                    {lang === "ar" && member.payment_status === "paid"
                      ? "مدفوع"
                      : lang === "ar" && member.payment_status === "pending"
                        ? "معلق"
                        : member.payment_status}
                  </Badge>
                </div>

                {member.notes ? (
                  <div className="pt-4 border-t border-border/50">
                    <span className="text-muted-foreground block text-xs mb-1">{t("ملاحظات", "Notes")}</span>
                    <p className="text-xs">{member.notes}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
              {isAdmin ? (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/admin/dashboard">{t("لوحة التحكم", "Admin dashboard")}</Link>
                </Button>
              ) : null}
              <Button type="button" variant="ghost" className="w-full text-muted-foreground hover:text-foreground" onClick={() => signOut()}>
                {t("تسجيل الخروج", "Sign out")}
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MemberPortal;
