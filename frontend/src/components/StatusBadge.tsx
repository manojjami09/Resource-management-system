import { cn } from "@/lib/utils";
import { EmployeeStatus, ProjectStatus } from "../types";

const employeeColors: Record<EmployeeStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  bench: "bg-amber-50 text-amber-700 border-amber-200",
  available: "bg-blue-50 text-blue-700 border-blue-200",
  "on-leave": "bg-slate-100 text-slate-600 border-slate-200",
};

const projectColors: Record<ProjectStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  planning: "bg-indigo-50 text-indigo-700 border-indigo-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  "on-hold": "bg-amber-50 text-amber-700 border-amber-200",
};

const dotColors: Record<string, string> = {
  active: "bg-emerald-500",
  bench: "bg-amber-500",
  available: "bg-blue-500",
  "on-leave": "bg-slate-400",
  planning: "bg-indigo-500",
  completed: "bg-slate-400",
  "on-hold": "bg-amber-500",
};

interface StatusBadgeProps {
  status: EmployeeStatus | ProjectStatus;
  type?: "employee" | "project";
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, type = "employee", showDot = true, className }: StatusBadgeProps) {
  const colors = type === "employee"
    ? employeeColors[status as EmployeeStatus]
    : projectColors[status as ProjectStatus];

  const label = status.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <span
      data-testid={`status-badge-${status}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        colors,
        className
      )}
    >
      {showDot && <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[status])} />}
      {label}
    </span>
  );
}
