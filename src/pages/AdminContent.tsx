import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Upload } from "lucide-react";

interface ContentForm {
  type: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  sort_order: number;
  is_active: boolean;
}

const emptyForm: ContentForm = {
  type: "exercise",
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",
  sort_order: 0,
  is_active: true,
};

const AdminContent = () => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ContentForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: content, isLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("content").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("gym-content").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("gym-content").getPublicUrl(path);
    return data.publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async (data: ContentForm) => {
      let image_url: string | undefined;
      if (imageFile) {
        image_url = await uploadImage(imageFile);
      }
      const payload = { ...data, ...(image_url ? { image_url } : {}) };
      if (editId) {
        const { error } = await supabase.from("content").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("content").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content"] });
      queryClient.invalidateQueries({ queryKey: ["content"] });
      setOpen(false);
      setEditId(null);
      setForm(emptyForm);
      setImageFile(null);
      toast({ title: editId ? "Content updated" : "Content added" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("content").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content"] });
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast({ title: "Content deleted" });
    },
  });

  const openEdit = (item: any) => {
    setEditId(item.id);
    setForm({
      type: item.type,
      title_ar: item.title_ar,
      title_en: item.title_en,
      description_ar: item.description_ar || "",
      description_en: item.description_en || "",
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-accent-foreground">Content Management</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm(emptyForm); setImageFile(null); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-orange text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" /> Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Content" : "Add Content"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="tip">Tip</SelectItem>
                  <SelectItem value="hero">Hero</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Title (Arabic)" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} required />
              <Input placeholder="Title (English)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} required />
              <Textarea placeholder="Description (Arabic)" value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
              <Textarea placeholder="Description (English)" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
              <Input type="number" placeholder="Sort Order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              <div className="flex items-center gap-3">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <span className="text-sm">Active</span>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : "Upload Image"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                </label>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content?.map((item) => (
            <Card key={item.id} className="bg-card border-border">
              {item.image_url && (
                <div className="h-40 overflow-hidden rounded-t-lg">
                  <img src={item.image_url} alt={item.title_en} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{item.title_en}</CardTitle>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded capitalize">{item.type}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.title_ar}</p>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(item.id)}>
                  <Trash2 className="h-3 w-3 mr-1 text-destructive" /> Delete
                </Button>
              </CardContent>
            </Card>
          ))}
          {(!content || content.length === 0) && (
            <div className="col-span-full text-center py-12 text-muted-foreground">No content yet</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminContent;
