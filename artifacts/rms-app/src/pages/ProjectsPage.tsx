import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Circle, ChevronUp, ChevronDown } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useDebounce } from "../hooks/useDebounce";
import { ProjectDrawer } from "../components/ProjectDrawer";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { AvatarGroup } from "../components/AvatarGroup";
import { Project, ProjectStatus } from "../types";
import { formatDate, formatCurrency } from "../utils/format";
import { cn } from "@/lib/utils";

const healthColors = {
  green: "text-emerald-500",
  yellow: "text-amber-400",
  red: "text-red-500",
};

export function ProjectsPage() {
  const { projects, loading } = useProjects();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProjectStatus[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(search, 250);

  const filtered = useMemo(() => {
    let data = [...projects];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      data = data.filter((p) =>
        p.projectName.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.manager.toLowerCase().includes(q) ||
        p.projectId.toLowerCase().includes(q)
      );
    }
    if (filterStatus.length) data = data.filter((p) => filterStatus.includes(p.status));
    return data;
  }, [projects, debouncedSearch, filterStatus]);

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
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500">{filtered.length} of {projects.length} projects</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              data-testid="input-project-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, clients..."
              className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm w-64 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
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
        </div>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 p-4">
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
        </motion.div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="projects-table">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["Project", "Client", "Manager", "Status", "Health", "Priority", "Team", "Completion", "Timeline", "Budget"].map((h) => (
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
                  className="border-b border-slate-50 hover:bg-indigo-50/30 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 whitespace-nowrap">{prj.projectName}</p>
                    <p className="text-xs text-slate-400">{prj.projectId}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{prj.client}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{prj.manager}</td>
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
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{formatCurrency(prj.budget, true)}</td>
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
