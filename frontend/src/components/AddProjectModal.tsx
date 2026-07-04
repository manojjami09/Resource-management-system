import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { addProject, updateProject } from "../services/projectService";
import { useToast } from "../hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";

export function AddProjectModal({ 
  onSuccess, 
  initialData, 
  trigger 
}: { 
  onSuccess: () => void; 
  initialData?: any; 
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: initialData?.projectName || initialData?.name || "",
    client: initialData?.client || "",
    status: initialData?.status || "active",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    requiredSkills: initialData?.requiredSkills?.join(", ") || "",
    teamSize: initialData?.teamSize || 10,
    budget: initialData?.budget || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        budget: parseFloat(formData.budget) || null,
        requiredSkills: formData.requiredSkills.split(',').map((s: string) => s.trim()).filter(Boolean)
      };
      
      if (initialData?.id) {
        await updateProject(initialData.id, payload);
        toast({ title: "Project Updated", description: "Successfully updated project." });
      } else {
        await addProject(payload);
        toast({ title: "Project Created", description: "Successfully created new project." });
      }
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({ 
        title: "Failed to create project", 
        description: error.response?.data?.message || "Please check required fields", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus className="h-4 w-4" />
            New Project
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? "Edit Project" : "Create New Project"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Name</label>
              <input required className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Client</label>
              <input required className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Start Date</label>
              <input required type="date" className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">End Date</label>
              <input required type="date" className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Req Skills</label>
              <input required placeholder="comma separated" className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.requiredSkills} onChange={e => setFormData({...formData, requiredSkills: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Team Size</label>
              <input required type="number" min={1} className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.teamSize} onChange={e => setFormData({...formData, teamSize: parseInt(e.target.value) || 0})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Budget (₹)</label>
              <input required type="number" className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialData ? "Save Changes" : "Save Project"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
