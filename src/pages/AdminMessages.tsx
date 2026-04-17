import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2, Mail, Phone, Trash2, Check } from "lucide-react";

const AdminMessages = () => {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
      toast({ title: "Message deleted" });
    },
  });

  const unreadCount = messages?.filter((m) => !m.is_read).length || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-accent-foreground">Contact Messages</h1>
        {unreadCount > 0 && <Badge variant="destructive">{unreadCount} unread</Badge>}
      </div>

      {isLoading ? (
        <div className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
      ) : !messages || messages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No messages yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.map((m) => (
            <Card key={m.id} className={`bg-card border-border ${!m.is_read ? "border-primary/50" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {m.name}
                      {!m.is_read && <Badge variant="default" className="text-[10px] px-1.5 py-0">NEW</Badge>}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(m.created_at), "PPp")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                  {m.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{m.email}</span>}
                  {m.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{m.phone}</span>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap mb-4">{m.message}</p>
                <div className="flex gap-2">
                  {!m.is_read && (
                    <Button size="sm" variant="outline" onClick={() => markRead.mutate(m.id)}>
                      <Check className="h-3 w-3 mr-1" /> Mark read
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => del.mutate(m.id)}>
                    <Trash2 className="h-3 w-3 mr-1 text-destructive" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
