import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, KeyRound, CheckCircle2, User, Phone, Check, CreditCard, ChevronRight, Share, Copy } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MemberForm {
  name: string;
  phone: string;
  subscription_type: string;
  start_date: string;
  end_date: string;
  payment_status: string;
  notes: string;
  /** Optional Supabase auth.users id to link the member portal */
  auth_user_id: string;
}

const emptyForm: MemberForm = {
  name: "",
  phone: "",
  subscription_type: "monthly",
  start_date: format(new Date(), "yyyy-MM-dd"),
  end_date: "",
  payment_status: "pending",
  notes: "",
  auth_user_id: "",
};

type MemberRow = Database["public"]["Tables"]["members"]["Row"];

const AdminMembers = () => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [accountMember, setAccountMember] = useState<MemberRow | null>(null);
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: MemberForm) => {
      const authUserId = data.auth_user_id.trim() === "" ? null : data.auth_user_id.trim();
      const payload = {
        name: data.name,
        phone: data.phone,
        subscription_type: data.subscription_type,
        start_date: data.start_date,
        end_date: data.end_date,
        payment_status: data.payment_status,
        notes: data.notes || null,
        auth_user_id: authUserId,
      };
      if (editId) {
        const { error } = await supabase.from("members").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("members").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setOpen(false);
      setEditId(null);
      setForm(emptyForm);
      toast({ title: editId ? "Member updated" : "Member added" });
    },
    onError: (e: unknown) =>
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast({ title: "Member deleted" });
    },
  });

  const createAccountMutation = useMutation({
    mutationFn: async (vars: { member_id: string; email: string; password: string }) => {
      const { data, error } = await supabase.functions.invoke("create-member-account", {
        body: vars,
      });
      if (error) {
        // Try to surface the function's JSON error message
        const ctx = (error as unknown as { context?: { json?: () => Promise<{ error?: string }> } }).context;
        if (ctx?.json) {
          try {
            const j = await ctx.json();
            if (j?.error) throw new Error(j.error);
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message) throw parseErr;
          }
        }
        throw error;
      }
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setAccountMember(null);
      setAccountEmail("");
      setAccountPassword("");
      toast({
        title: "Account created",
        description: "Share the email and password with the member to sign in at /member.",
      });
    },
    onError: (e: unknown) =>
      toast({
        title: "Could not create account",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      }),
  });

  const openEdit = (member: MemberRow) => {
    setEditId(member.id);
    setForm({
      name: member.name,
      phone: member.phone,
      subscription_type: member.subscription_type,
      start_date: member.start_date,
      end_date: member.end_date,
      payment_status: member.payment_status,
      notes: member.notes || "",
      auth_user_id: member.auth_user_id ?? "",
    });
    setOpen(true);
  };

  const openCreateAccount = (member: MemberRow) => {
    setAccountMember(member);
    setAccountEmail("");
    setAccountPassword("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-accent-foreground">Members</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-orange text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Member" : "Add Member"}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }}
              className="space-y-4"
            >
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <Select value={form.subscription_type} onValueChange={(v) => setForm({ ...form, subscription_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Start Date</label>
                  <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">End Date</label>
                  <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
                </div>
              </div>
              <Select value={form.payment_status} onValueChange={(v) => setForm({ ...form, payment_status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Linked member account (UUID, optional)</label>
                <Input
                  placeholder="auth.users id for member portal"
                  value={form.auth_user_id}
                  onChange={(e) => setForm({ ...form, auth_user_id: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
              <Button type="submit" className="w-full gradient-orange text-primary-foreground" disabled={saveMutation.isPending}>
                {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editId ? "Update" : "Add"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Create account dialog */}
      <Dialog open={!!accountMember} onOpenChange={(v) => { if (!v) setAccountMember(null); }}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Create login for {accountMember?.name}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!accountMember) return;
              createAccountMutation.mutate({
                member_id: accountMember.id,
                email: accountEmail.trim(),
                password: accountPassword,
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Email</label>
              <Input
                type="email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                placeholder="member@example.com"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Password (6+ chars)</label>
              <Input
                type="text"
                value={accountPassword}
                onChange={(e) => setAccountPassword(e.target.value)}
                placeholder="Set an initial password"
                minLength={6}
                maxLength={128}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Share these credentials with the member. They sign in at <code>/member</code>.
              </p>
            </div>
            <Button
              type="submit"
              className="w-full gradient-orange text-primary-foreground"
              disabled={createAccountMutation.isPending}
            >
              {createAccountMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Create account
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center py-20 bg-background/50 rounded-lg flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground animate-pulse">Loading members...</p>
        </div>
      ) : (
        <Card className="border-sidebar-border bg-sidebar-accent overflow-hidden shadow-lg">
          <CardHeader className="bg-white/5 pb-4 border-b border-sidebar-border">
            <CardTitle className="text-white">Member Directory</CardTitle>
            <CardDescription className="text-slate-300">Manage your gym members, subscriptions, and accounts.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="hover:bg-transparent border-sidebar-border">
                    <TableHead className="w-[250px] text-start text-white font-semibold">Member</TableHead>
                    <TableHead className="text-start text-white font-semibold">Contact</TableHead>
                    <TableHead className="text-start text-white font-semibold">Plan Details</TableHead>
                    <TableHead className="text-start text-white font-semibold">Payment</TableHead>
                    <TableHead className="text-start text-white font-semibold">Portal Access</TableHead>
                    <TableHead className="text-end text-white font-semibold px-4">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members?.map((m) => (
                    <TableRow key={m.id} className="group hover:bg-background/40 border-sidebar-border transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-primary/20 bg-primary/5">
                            <AvatarFallback className="bg-transparent text-primary font-semibold">
                              {m.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium text-white group-hover:text-primary transition-colors">
                            {m.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-slate-300 gap-2">
                          <Phone className="h-3.5 w-3.5" />
                          {m.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium capitalize text-sm text-white">{m.subscription_type}</span>
                          <span className="text-xs text-slate-400">
                            {format(new Date(m.start_date), "MMM d, yyyy")} - {format(new Date(m.end_date), "MMM d, yyyy")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={m.payment_status === "paid" ? "default" : "destructive"} 
                          className={m.payment_status === "paid" ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm" : "bg-orange-600 text-white hover:bg-orange-700 shadow-sm"}
                        >
                          <CreditCard className="h-3 w-3 mr-1" />
                          {m.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {m.auth_user_id ? (
                          <div className="flex items-center text-xs text-emerald-600 font-medium gap-1.5">
                            <CheckCircle2 className="h-4 w-4" /> 
                            <span>Linked</span>
                          </div>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openCreateAccount(m)}
                            className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                          >
                            <KeyRound className="h-3.5 w-3.5 mr-1.5" /> Create login
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-end px-4">
                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(m)} className="text-slate-300 hover:text-white hover:bg-white/10">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(m.id)} className="text-slate-300 hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!members || members.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                          <div className="h-16 w-16 bg-sidebar-border rounded-full flex items-center justify-center mb-2 shadow-inner">
                            <User className="h-8 w-8 opacity-50" />
                          </div>
                          <p className="text-lg font-medium text-foreground">No members yet</p>
                          <p className="text-sm max-w-sm text-center">Get started by adding your first gym member. You can track their subscription and payment status here.</p>
                          <Button onClick={() => setOpen(true)} variant="outline" className="mt-4">
                            <Plus className="h-4 w-4 mr-2" /> Add Your First Member
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminMembers;
