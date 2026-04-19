import { useState } from "react";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, MapPin, Phone, Send } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
});

export const ContactSection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: t("بيانات غير صحيحة", "Invalid input"),
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast({
        title: t("حدث خطأ", "Error"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: t("تم الإرسال بنجاح", "Message sent"),
      description: t("سنتواصل معك قريباً", "We'll get back to you soon"),
    });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      <div className="top-0 right-0 absolute bg-primary/15 blur-3xl rounded-full w-72 h-72 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="bottom-0 left-0 absolute bg-primary/10 blur-3xl rounded-full w-64 h-64 translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <div className="px-4 max-w-3xl container">
        <h2 className="mb-4 font-bold text-3xl md:text-4xl text-center">
          {t("تواصل معنا", "Contact Us")}
        </h2>
        <p className="mb-12 text-muted-foreground text-center">
          {t(
            "لأي استفسار أو حجز اشتراك، راسلنا وسنرد عليك في أسرع وقت",
            "For any inquiry or subscription, send us a message and we'll respond promptly",
          )}
        </p>
        <Card className="group bg-card/80 shadow-sm backdrop-blur-sm border-border/50 hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 soft-3d-card">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <Input
                  placeholder={t("الاسم الكامل *", "Full name *")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={100}
                  required
                />
                <Input
                  type="tel"
                  placeholder={t("رقم الهاتف", "Phone number")}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={30}
                />
              </div>
              <Input
                type="email"
                placeholder={t("البريد الإلكتروني", "Email")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
              />
              <Textarea
                placeholder={t("رسالتك *", "Your message *")}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={2000}
                rows={5}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="group/btn w-full text-primary-foreground gradient-orange hover:shadow-lg transition-all"
              >
                {loading ? (
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                ) : (
                  <Send className="mr-2 w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                )}
                {t("إرسال الرسالة", "Send Message")}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mt-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm">fitnes-Gym@gmail.com</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-sm">+970 59 000 0000</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm">{t("فلسطين", "Palestine")}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mt-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="flex justify-center items-center bg-card hover:bg-primary/10 border border-border hover:border-primary/40 rounded-full w-10 h-10 text-muted-foreground hover:text-primary transition-all hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5Zm8.88 1.62a1.12 1.12 0 1 1 0 2.25 1.12 1.12 0 0 1 0-2.25ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="flex justify-center items-center bg-card hover:bg-primary/10 border border-border hover:border-primary/40 rounded-full w-10 h-10 text-muted-foreground hover:text-primary transition-all hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M13.5 22v-8h2.8l.42-3.25H13.5V8.68c0-.94.26-1.58 1.6-1.58h1.71V4.2A23.4 23.4 0 0 0 14.3 4C11.82 4 10.1 5.52 10.1 8.32v2.43H7.3V14h2.8v8h3.4Z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
