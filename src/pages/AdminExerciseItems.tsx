import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Upload, Dumbbell } from "lucide-react";

interface ItemForm {
  content_id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  sort_order: number;
}

const empty: ItemForm = {
  content_id: "",
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",
  sets: 3,
  reps: "10-12",
  rest_seconds: 60,
  sort_order: 0,
};

const AdminExerciseItems = () => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ItemForm>(empty);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [filterContentId, setFilterContentId] = useState<string>("all");
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: programs } = useQuery({
    queryKey: ["exercise-programs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("content").select("id,title_en,title_ar").eq("type", "exercise").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-exercise-items", filterContentId],
    queryFn: async () => {
      let q = supabase.from("exercise_items").select("*, content:content_id(title_en)").order("sort_order");
      if (filterContentId !== "all") q = q.eq("content_id", filterContentId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const upload = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `items/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("gym-content").upload(path, file);
    if (error) throw error;
    return supabase.storage.from("gym-content").getPublicUrl(path).data.publicUrl;
  };

  const save = useMutation({
    mutationFn: async (data: ItemForm) => {
      let image_url: string | undefined;
      if (imageFile) image_url = await upload(imageFile);
      const payload = { ...data, ...(image_url ? { image_url } : {}) };
      if (editId) {
        const { error } = await supabase.from("exercise_items").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("exercise_items").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-exercise-items"] });
      qc.invalidateQueries({ queryKey: ["exercise-items"] });
      setOpen(false);
      setEditId(null);
      setForm(empty);
      setImageFile(null);
      toast({ title: editId ? "Exercise updated" : "Exercise added" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("exercise_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-exercise-items"] });
      toast({ title: "Deleted" });
    },
  });

  const openEdit = (item: any) => {
    setEditId(item.id);
    setForm({
      content_id: item.content_id,
      title_ar: item.title_ar,
      title_en: item.title_en,
      description_ar: item.description_ar || "",
      description_en: item.description_en || "",
      sets: item.sets,
      reps: item.reps,
      rest_seconds: item.rest_seconds,
      sort_order: item.sort_order,
    });
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-accent-foreground">Exercise Details</h1>
        <div className="flex items-center gap-3">
          <Select value={filterContentId} onValueChange={setFilterContentId}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {programs?.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.title_en}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm(empty); setImageFile(null); } }}>
            <DialogTrigger asChild>
              <Button className="gradient-orange text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" /> Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editId ? "Edit Exercise" : "Add Exercise"}</DialogTitle></DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-4">
                <Select value={form.content_id} onValueChange={(v) => setForm({ ...form, content_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select Program" /></SelectTrigger>
                  <SelectContent>
                    {programs?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.title_en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="Title (Arabic)" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} required />
                <Input placeholder="Title (English)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} required />
                <Textarea placeholder="Description (Arabic)" value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
                <Textarea placeholder="Description (English)" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
                <div className="grid grid-cols-3 gap-2">
                  <Input type="number" placeholder="Sets" value={form.sets} onChange={(e) => setForm({ ...form, sets: parseInt(e.target.value) || 0 })} />
                  <Input placeholder="Reps (e.g. 10-12)" value={form.reps} onChange={(e) => setForm({ ...form, reps: e.target.value })} />
                  <Input type="number" placeholder="Rest (s)" value={form.rest_seconds} onChange={(e) => setForm({ ...form, rest_seconds: parseInt(e.target.value) || 0 })} />
                </div>
                <Input type="number" placeholder="Sort Order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
                <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg p-4 hover:bg-muted/50">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : "Upload Image"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                </label>
                <Button type="submit" className="w-full gradient-orange text-primary-foreground" disabled={save.isPending || !form.content_id}>
                  {save.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {editId ? "Update" : "Add"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
      ) : !items || items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 text-primary/40" />
          <p>No exercises yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any) => (
            <Card key={item.id} className="bg-card border-border">
              {item.image_url && (
                <div className="h-40 overflow-hidden rounded-t-lg">
                  <img src={item.image_url} alt={item.title_en} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{item.title_en}</CardTitle>
                <p className="text-xs text-muted-foreground">{item.content?.title_en}</p>
                <p className="text-xs text-primary">{item.sets} × {item.reps} • {item.rest_seconds}s rest</p>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => del.mutate(item.id)}>
                  <Trash2 className="h-3 w-3 mr-1 text-destructive" /> Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminExerciseItems;
