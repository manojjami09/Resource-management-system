import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Project, Employee, Milestone } from "../types";
import { getProjectTeam } from "../services/projectService";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { SkillBadge } from "./SkillBadge";
import { AvatarGroup } from "./AvatarGroup";
import { formatDate } from "../utils/format";
import { cn } from "@/lib/utils";

const healthConfig = {
  green: { color: "text-emerald-600", bg: "bg-emerald-500", label: "On Track" },
  yellow: { color: "text-amber-600", bg: "bg-amber-400", label: "At Risk" },
  red: { color: "text-red-600", bg: "bg-red-500", label: "Critical" },
};

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDrawer({ project, onClose }: ProjectDrawerProps) {
  const [team, setTeam] = useState<Employee[]>([]);

  useEffect(() => {
    if (!project) { setTeam([]); return; }
    getProjectTeam(project.id).then(setTeam);
  }, [project?.id]);

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-30"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            data-testid="project-drawer"
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-40 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <button onClick={onClose} data-testid="close-drawer-btn" className="p-1 rounded-md hover:bg-white/20 transition-colors">
                  <X className="h-5 w-5" />
                </button>
                <div className="flex gap-2">
                  <StatusBadge status={project.status} type="project" className="bg-white/20 text-white border-white/30" />
                  <PriorityBadge priority={project.priority} className="bg-white/20 text-white border-white/30" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-1">{project.projectName}</h2>
              <p className="text-slate-300 text-sm">{project.client}</p>
              <p className="text-slate-400 text-xs mt-0.5">{project.projectId} · {project.manager}</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-5">
                {/* Completion & Health */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-slate-900">{project.completionPercent}%</p>
                    <p className="text-xs text-slate-500 mt-0.5">Complete</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className={cn("text-sm font-bold", healthConfig[project.health].color)}>
                      {healthConfig[project.health].label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Health</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-slate-900">{project.vacantPositions}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Vacancies</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Overall Progress</span>
                    <span>{project.completionPercent}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${project.completionPercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={cn("h-full rounded-full", project.health === "green" ? "bg-indigo-500" : project.health === "yellow" ? "bg-amber-400" : "bg-red-500")}
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Timeline</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formatDate(project.startDate)} → {formatDate(project.endDate)}</span>
                  </div>
                </div>

                {/* Team */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                    Team ({project.allocatedSize}/{project.teamSize})
                  </h3>
                  {team.length > 0 ? (
                    <div className="space-y-2">
                      <AvatarGroup names={team.map((e) => e.employeeName)} max={8} />
                      <div className="space-y-1.5">
                        {team.slice(0, 4).map((emp) => (
                          <div key={emp.id} className="flex items-center gap-2.5 text-sm">
                            <img src={emp.avatar} alt={emp.employeeName} className="h-6 w-6 rounded-full bg-slate-100" />
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-slate-700 truncate block">{emp.employeeName}</span>
                            </div>
                            <span className="text-xs text-slate-400">{emp.designation}</span>
                          </div>
                        ))}
                        {team.length > 4 && <p className="text-xs text-slate-400">+{team.length - 4} more team members</p>}
                      </div>
                    </div>
                  ) : <p className="text-sm text-slate-400">Loading team...</p>}
                </div>

                {/* Required Skills */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.requiredSkills.map((s) => <SkillBadge key={s} skill={s} />)}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Milestones</h3>
                  <div className="space-y-2.5">
                    {project.milestones.map((m, i) => (
                      <div key={i} className="flex items-start gap-3">
                        {m.completed
                          ? <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          : <Clock className="h-4 w-4 text-slate-300 flex-shrink-0 mt-0.5" />}
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-medium", m.completed ? "text-slate-700" : "text-slate-500")}>{m.name}</p>
                          <p className="text-xs text-slate-400">{formatDate(m.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk & Budget */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">Risk Level</p>
                    <div className="flex items-center gap-1.5">
                      {project.riskLevel === "high" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      <span className={cn("text-sm font-semibold capitalize",
                        project.riskLevel === "high" ? "text-red-600" : project.riskLevel === "medium" ? "text-amber-600" : "text-emerald-600"
                      )}>
                        {project.riskLevel}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">Budget Burn</p>
                    <p className="text-sm font-semibold text-slate-800">{Math.round((project.billedAmount / project.budget) * 100)}%</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Description</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
