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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";

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

      {isLoading ? (
        <div className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
      ) : (
        <div className="bg-card rounded-lg border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.phone}</TableCell>
                  <TableCell className="capitalize">{m.subscription_type}</TableCell>
                  <TableCell>{m.start_date}</TableCell>
                  <TableCell>{m.end_date}</TableCell>
                  <TableCell>
                    <Badge variant={m.payment_status === "paid" ? "default" : "destructive"} className={m.payment_status === "paid" ? "bg-green-600" : ""}>
                      {m.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(m)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(m.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!members || members.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No members yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
