import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { differenceInDays, parseISO, format } from "date-fns";
import { Clock, CreditCard, AlertTriangle } from "lucide-react";
import { Loader2 } from "lucide-react";

const AdminNotifications = () => {
  const { data: members, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const now = new Date();
  const expiringSoon = members?.filter((m) => {
    const daysLeft = differenceInDays(parseISO(m.end_date), now);
    return daysLeft >= 0 && daysLeft <= 5;
  }) || [];

  const pendingPayments = members?.filter((m) => m.payment_status === "pending") || [];

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-accent-foreground">Notifications</h1>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-yellow-500" />
            Expiring Soon (within 5 days)
            <Badge variant="destructive">{expiringSoon.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {expiringSoon.length === 0 ? (
            <p className="text-muted-foreground text-sm">No subscriptions expiring soon</p>
          ) : (
            expiringSoon.map((m) => {
              const daysLeft = differenceInDays(parseISO(m.end_date), now);
              return (
                <div key={m.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.phone} · {m.subscription_type}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {daysLeft === 0 ? "Expires today" : `${daysLeft} days left`}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Ends {format(parseISO(m.end_date), "MMM dd, yyyy")}</p>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-destructive" />
            Pending Payments
            <Badge variant="destructive">{pendingPayments.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingPayments.length === 0 ? (
            <p className="text-muted-foreground text-sm">No pending payments</p>
          ) : (
            pendingPayments.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.phone} · {m.subscription_type}</p>
                </div>
                <Badge variant="destructive">Pending</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotifications;
