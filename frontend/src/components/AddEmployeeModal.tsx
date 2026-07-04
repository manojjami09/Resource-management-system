import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { addEmployee } from "../services/employeeService";
import { useToast } from "../hooks/use-toast";
import { Plus, Loader2, X } from "lucide-react";

export function AddEmployeeModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    joiningDate: new Date().toISOString().split('T')[0],
    designation: "",
    department: "",
    status: "BENCH",
    monthlyCost: ""
  });
  
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (newSkill && !skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addEmployee({
        name: formData.name,
        email: formData.email,
        joiningDate: formData.joiningDate,
        designation: formData.designation,
        department: formData.department,
        status: formData.status,
        monthlyCost: parseFloat(formData.monthlyCost) || null,
        skills: skills.map(s => ({ name: s, proficiencyLevel: "BEGINNER" }))
      });
      toast({ 
        title: "Employee Added", 
        description: "Employee created successfully. They can log in with their email and default password: Welcome@123",
        duration: 5000 
      });
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({ 
        title: "Failed to add employee", 
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
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Name</label>
              <input required className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">
                Email <span className="text-red-500">*</span>
              </label>
              <input required type="email" className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Joining Date</label>
              <input required type="date" className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.joiningDate} onChange={e => setFormData({...formData, joiningDate: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Designation</label>
              <input required className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Department</label>
              <input required className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Monthly Cost (₹)</label>
              <input type="number" required className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.monthlyCost} onChange={e => setFormData({...formData, monthlyCost: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Status</label>
              <select required className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="BENCH">BENCH</option>
                <option value="ALLOCATED">ALLOCATED</option>
                <option value="ON_LEAVE">ON_LEAVE</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right text-sm pt-2">Skills</label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span key={skill} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-medium border border-indigo-100">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input 
                  placeholder="Type a skill and press Enter" 
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2" 
                  value={skillInput} 
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Employee
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
