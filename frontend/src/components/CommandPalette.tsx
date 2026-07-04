import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, FolderKanban, Sparkles, BarChart3,
  FileText, Bell, Settings, Search, ArrowRight, User,
} from "lucide-react";
import { searchEmployees } from "../services/employeeService";
import { searchProjects } from "../services/projectService";
import { Employee, Project } from "../types";
import { useDebounce } from "../hooks/useDebounce";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const NAV_COMMANDS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", path: "/employees", icon: Users },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Smart Allocation", path: "/allocation", icon: Sparkles },
  { label: "Skill Gap Analytics", path: "/skill-gap", icon: BarChart3 },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 200);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!open) { setQuery(""); setEmployees([]); setProjects([]); return; }
  }, [open]);

  useEffect(() => {
    if (!debouncedQuery) { setEmployees([]); setProjects([]); return; }
    searchEmployees(debouncedQuery).then(setEmployees);
    searchProjects(debouncedQuery).then(setProjects);
  }, [debouncedQuery]);

  const navigate = (path: string) => { setLocation(path); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-24 z-50 w-full max-w-xl -translate-x-1/2"
          >
            <Command className="rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden" shouldFilter={false}>
              <div className="flex items-center border-b border-slate-100 px-4">
                <Search className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
                <Command.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search pages, employees, projects..."
                  className="flex-1 py-4 text-sm outline-none text-slate-900 placeholder:text-slate-400 bg-transparent"
                  data-testid="command-palette-input"
                  autoFocus
                />
                <kbd className="hidden md:flex text-xs text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">Esc</kbd>
              </div>
              <Command.List className="max-h-80 overflow-y-auto py-2">
                {!query && (
                  <Command.Group heading={<span className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wide block">Navigation</span>}>
                    {NAV_COMMANDS.map((cmd) => (
                      <Command.Item
                        key={cmd.path}
                        value={cmd.label}
                        onSelect={() => navigate(cmd.path)}
                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-700 transition-colors"
                        data-testid={`cmd-nav-${cmd.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <cmd.icon className="h-4 w-4 text-slate-400" />
                        {cmd.label}
                        <ArrowRight className="h-3 w-3 text-slate-300 ml-auto" />
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {employees.length > 0 && (
                  <Command.Group heading={<span className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wide block">Employees</span>}>
                    {employees.map((emp) => (
                      <Command.Item
                        key={emp.id}
                        value={emp.employeeName}
                        onSelect={() => navigate("/employees")}
                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 data-[selected=true]:bg-indigo-50 transition-colors"
                        data-testid={`cmd-emp-${emp.id}`}
                      >
                        <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User className="h-3.5 w-3.5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium">{emp.employeeName}</p>
                          <p className="text-xs text-slate-400">{emp.designation} · {emp.department}</p>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {projects.length > 0 && (
                  <Command.Group heading={<span className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wide block">Projects</span>}>
                    {projects.map((prj) => (
                      <Command.Item
                        key={prj.id}
                        value={prj.projectName}
                        onSelect={() => navigate("/projects")}
                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 data-[selected=true]:bg-indigo-50 transition-colors"
                        data-testid={`cmd-prj-${prj.id}`}
                      >
                        <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FolderKanban className="h-3.5 w-3.5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium">{prj.projectName}</p>
                          <p className="text-xs text-slate-400">{prj.client} · {prj.status}</p>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {query && employees.length === 0 && projects.length === 0 && (
                  <Command.Empty className="py-8 text-center text-sm text-slate-400">
                    No results for "{query}"
                  </Command.Empty>
                )}
              </Command.List>
              <div className="border-t border-slate-100 px-4 py-2 flex items-center gap-4">
                <span className="text-xs text-slate-400">Press <kbd className="border border-slate-200 rounded px-1">↑↓</kbd> to navigate</span>
                <span className="text-xs text-slate-400"><kbd className="border border-slate-200 rounded px-1">↵</kbd> to select</span>
                <span className="text-xs text-slate-400 ml-auto">Ctrl+K to toggle</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
