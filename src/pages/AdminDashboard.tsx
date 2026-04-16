import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, CreditCard, Dumbbell } from "lucide-react";

const AdminDashboard = () => {
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const totalMembers = members?.length || 0;
  const pendingPayments = members?.filter((m) => m.payment_status === "pending").length || 0;
  const activeMembers = members?.filter((m) => new Date(m.end_date) >= new Date()).length || 0;

  const stats = [
    { title: "Total Members", value: totalMembers, icon: Users, color: "text-primary" },
    { title: "Active", value: activeMembers, icon: Dumbbell, color: "text-green-500" },
    { title: "Pending Payments", value: pendingPayments, icon: CreditCard, color: "text-yellow-500" },
    { title: "Expired", value: totalMembers - activeMembers, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-accent-foreground">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-sidebar-accent border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-sidebar-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
