import { useState } from "react";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Send } from "lucide-react";

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
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: t("بيانات غير صحيحة", "Invalid input"),
        description: parsed.error.errors[0].message,
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
      toast({ title: t("حدث خطأ", "Error"), description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: t("تم الإرسال بنجاح", "Message sent"),
      description: t("سنتواصل معك قريباً", "We'll get back to you soon"),
    });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="py-20">
      <div className="container px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t("تواصل معنا", "Contact Us")}
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          {t("لأي استفسار أو حجز اشتراك، راسلنا وسنرد عليك في أسرع وقت", "For any inquiry or subscription, send us a message and we'll respond promptly")}
        </p>
        <Card className="border-border/50">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full gradient-orange text-primary-foreground"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                {t("إرسال الرسالة", "Send Message")}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="flex justify-center mt-8 text-muted-foreground gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <span className="text-sm">info@fitnessgym.ps</span>
        </div>
      </div>
    </section>
  );
};
