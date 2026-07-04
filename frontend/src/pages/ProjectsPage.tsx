import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Circle, ChevronUp, ChevronDown, Edit2, Trash2 } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useDebounce } from "../hooks/useDebounce";
import { ProjectDrawer } from "../components/ProjectDrawer";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { AvatarGroup } from "../components/AvatarGroup";
import { Project, ProjectStatus } from "../types";
import { formatDate, formatCurrency } from "../utils/format";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/AuthContext";
import { AddProjectModal } from "../components/AddProjectModal";
import { deleteProject } from "../services/projectService";

const healthColors = {
  green: "text-emerald-500",
  yellow: "text-amber-400",
  red: "text-red-500",
};

export function ProjectsPage() {
  const { projects, loading } = useProjects();
  const { role } = useAuth();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProjectStatus[]>([]);
  const [filterClient, setFilterClient] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [filterHealth, setFilterHealth] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(search, 250);

  const uniqueClients = useMemo(() => Array.from(new Set(projects.map(p => p.client))).filter(Boolean), [projects]);

  const filtered = useMemo(() => {
    let data = [...projects];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      data = data.filter((p) =>
        p.projectName.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.projectId.toLowerCase().includes(q)
      );
    }
    if (filterStatus.length) data = data.filter((p) => filterStatus.includes(p.status));
    if (filterClient.length) data = data.filter((p) => filterClient.includes(p.client));
    if (filterPriority.length) data = data.filter((p) => filterPriority.includes(p.priority));
    if (filterHealth.length) data = data.filter((p) => filterHealth.includes(p.health));
    return data;
  }, [projects, debouncedSearch, filterStatus, filterClient, filterPriority, filterHealth]);

  if (loading) return (
    <div className="p-6">
      <div className="h-10 bg-slate-200 rounded-lg w-48 mb-6 animate-pulse" />
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 px-6 flex items-center">
            <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500">{filtered.length} of {projects.length} projects</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              data-testid="input-project-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, clients..."
              className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm w-full sm:w-64 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
              showFilters ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>
          
          {(role === "ROLE_ADMIN" || role === "ROLE_MANAGER") && (
            <AddProjectModal onSuccess={() => {}} />
          )}
        </div>
      </div>

        {/* Filter bar */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {(["active", "planning", "on-hold", "completed"] as ProjectStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}
                    className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize",
                      filterStatus.includes(s) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    )}
                  >
                    {s.split("-").join(" ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Health</p>
                <div className="flex flex-wrap gap-2">
                  {["green", "yellow", "red"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterHealth((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}
                      className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize",
                        filterHealth.includes(s) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Priority</p>
                <div className="flex flex-wrap gap-2">
                  {["low", "medium", "high"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterPriority((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}
                      className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize",
                        filterPriority.includes(s) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Client</p>
                <div className="flex flex-wrap gap-2">
                  {uniqueClients.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilterClient((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])}
                      className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                        filterClient.includes(c) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="projects-table">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["Project", "Client", "Status", "Health", "Priority", "Team", "Completion", "Timeline"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((prj, i) => (
                <motion.tr
                  key={prj.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelected(prj)}
                  data-testid={`row-project-${prj.id}`}
                  className="border-b border-slate-50 hover:bg-indigo-50/30 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 whitespace-nowrap">{prj.projectName}</p>
                    <p className="text-xs text-slate-400">{prj.projectId}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{prj.client}</td>
                  <td className="px-4 py-3"><StatusBadge status={prj.status} type="project" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Circle className={cn("h-3 w-3 fill-current", healthColors[prj.health])} />
                      <span className={cn("text-xs font-medium capitalize", healthColors[prj.health])}>
                        {prj.health === "green" ? "On Track" : prj.health === "yellow" ? "At Risk" : "Critical"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><PriorityBadge priority={prj.priority} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-700">{prj.allocatedSize}</span>
                      <span className="text-xs text-slate-400">/ {prj.teamSize}</span>
                      {prj.vacantPositions > 0 && (
                        <span className="text-xs text-amber-600 font-medium">({prj.vacantPositions} open)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 min-w-24">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", prj.health === "green" ? "bg-indigo-500" : prj.health === "yellow" ? "bg-amber-400" : "bg-red-400")}
                          style={{ width: `${prj.completionPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600">{prj.completionPercent}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                    {formatDate(prj.startDate).split(" ").slice(0, 2).join(" ")} → {formatDate(prj.endDate).split(" ").slice(0, 2).join(" ")}
                  </td>
                  {(role === "ROLE_ADMIN" || role === "ROLE_MANAGER") && (
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <AddProjectModal 
                          initialData={prj} 
                          onSuccess={() => window.location.reload()} 
                          trigger={<button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50"><Edit2 className="h-4 w-4" /></button>} 
                        />
                        <button 
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                          onClick={async () => {
                            if (confirm("Are you sure you want to delete this project?")) {
                              await deleteProject(prj.id);
                              window.location.reload();
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProjectDrawer project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
