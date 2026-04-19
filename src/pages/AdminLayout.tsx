import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Loader2, Users, FileText, Bell, LogOut, Dumbbell, LayoutDashboard, ListChecks, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: expiringMembers } = useQuery({
    queryKey: ["expiring-members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("*");
      if (error) throw error;
      const now = new Date();
      return (data || []).filter((m) => {
        const daysLeft = differenceInDays(parseISO(m.end_date), now);
        return daysLeft >= 0 && daysLeft <= 5;
      });
    },
    enabled: !!user && isAdmin,
  });

  const { data: pendingPayments } = useQuery({
    queryKey: ["pending-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("payment_status", "pending");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && isAdmin,
  });

  const { data: unreadMessages } = useQuery({
    queryKey: ["unread-messages"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user && isAdmin,
  });

  const notificationCount = (expiringMembers?.length || 0) + (pendingPayments?.length || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/members", icon: Users, label: "Members" },
    { path: "/admin/content", icon: FileText, label: "Content" },
    { path: "/admin/exercises", icon: ListChecks, label: "Exercises" },
    { path: "/admin/messages", icon: MessageSquare, label: "Messages", badge: unreadMessages },
    { path: "/admin/notifications", icon: Bell, label: "Notifications", badge: notificationCount },
  ];

  return (
    <div className="min-h-screen flex bg-accent">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-sidebar-primary" />
            <span className="font-bold text-sidebar-foreground">Fitness Gym</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === item.path
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.badge ? (
                <Badge variant="destructive" className="ml-auto text-xs px-1.5 py-0">
                  {item.badge}
                </Badge>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
