import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, MapPin, Briefcase, Calendar, Award, ExternalLink } from "lucide-react";
import { Employee, Allocation, TimelineEvent } from "../types";
import { getEmployeeAllocations, getEmployeeTimeline } from "../services/employeeService";
import { StatusBadge } from "./StatusBadge";
import { SkillBadge } from "./SkillBadge";
import { UtilizationGauge } from "./UtilizationGauge";
import { formatDate, getDaysUntil } from "../utils/format";
import { cn } from "@/lib/utils";

interface EmployeePanelProps {
  employee: Employee | null;
  onClose: () => void;
}

export function EmployeePanel({ employee, onClose }: EmployeePanelProps) {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [tab, setTab] = useState<"overview" | "allocations" | "timeline">("overview");

  useEffect(() => {
    if (!employee) { setAllocations([]); setTimeline([]); return; }
    setTab("overview");
    getEmployeeAllocations(employee.id).then(setAllocations);
    getEmployeeTimeline(employee.id).then(setTimeline);
  }, [employee?.id]);

  return (
    <AnimatePresence>
      {employee && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-30"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            data-testid="employee-panel"
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-40 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <button onClick={onClose} data-testid="close-panel-btn" className="p-1 rounded-md hover:bg-white/20 transition-colors">
                  <X className="h-5 w-5" />
                </button>
                <StatusBadge status={employee.status} showDot={true} className="bg-white/20 text-white border-white/30 border" />
              </div>
              <div className="flex items-center gap-4">
                <img src={employee.avatar} alt={employee.employeeName} className="h-16 w-16 rounded-full border-2 border-white/30 bg-white" />
                <div>
                  <h2 className="text-xl font-bold">{employee.employeeName}</h2>
                  <p className="text-indigo-200 text-sm">{employee.designation}</p>
                  <p className="text-indigo-300 text-xs mt-0.5">{employee.employeeId} · {employee.department}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-white">
              {(["overview", "allocations", "timeline"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  data-testid={`tab-${t}`}
                  className={cn("flex-1 py-3 text-xs font-semibold capitalize transition-colors",
                    tab === t ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {tab === "overview" && (
                <div className="p-5 space-y-5">
                  {/* Contact */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Contact</h3>
                    <div className="space-y-2">
                      {[
                        { icon: Mail, label: employee.email },
                        { icon: Phone, label: employee.phone },
                        { icon: MapPin, label: employee.location },
                        { icon: Briefcase, label: `${employee.experience} years experience` },
                        { icon: Calendar, label: `Joined ${formatDate(employee.joiningDate)}` },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2.5 text-sm text-slate-600">
                          <Icon className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Utilization */}
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Current Utilization</p>
                      <p className="text-2xl font-bold text-slate-900">{employee.utilization}%</p>
                      {employee.currentProject && (
                        <p className="text-xs text-indigo-600 mt-0.5">{employee.currentProject}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">Available: {formatDate(employee.availabilityDate)}</p>
                    </div>
                    <UtilizationGauge value={employee.utilization} size="md" showLabel={false} />
                  </div>

                  {/* Manager */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Manager</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                        {employee.manager.split(" ").map(n => n[0]).join("")}
                      </div>
                      {employee.manager}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {employee.skills.map((s) => <SkillBadge key={s} skill={s} />)}
                    </div>
                  </div>

                  {/* Certifications */}
                  {employee.certifications.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Certifications</h3>
                      <div className="space-y-1.5">
                        {employee.certifications.map((c) => (
                          <div key={c} className="flex items-center gap-2 text-sm text-slate-600">
                            <Award className="h-3.5 w-3.5 text-amber-500" />
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === "allocations" && (
                <div className="p-5 space-y-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Project Allocations</h3>
                  {allocations.length === 0 ? (
                    <p className="text-sm text-slate-400 py-4 text-center">No allocations found</p>
                  ) : allocations.map((a) => (
                    <div key={a.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-slate-800">{a.projectName}</p>
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", a.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                          {a.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">{a.role} · {a.allocationPercent}% allocation</p>
                      <p className="text-xs text-slate-400">{formatDate(a.startDate)} → {formatDate(a.endDate)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={cn("text-xs px-1.5 py-0.5 rounded", a.billable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                          {a.billable ? "Billable" : "Non-Billable"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === "timeline" && (
                <div className="p-5">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Career Timeline</h3>
                  <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                    {timeline.map((event, i) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="relative"
                      >
                        <div className="absolute -left-[29px] h-4 w-4 rounded-full bg-indigo-100 border-2 border-indigo-500 flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        </div>
                        <p className="text-xs text-slate-400 mb-0.5">{formatDate(event.date)}</p>
                        <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                        <p className="text-xs text-slate-500">{event.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
