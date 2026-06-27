import { cn } from "@/lib/utils";
import { ProjectPriority } from "../types";

const colors: Record<ProjectPriority, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-blue-50 text-blue-700 border-blue-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
};

export function PriorityBadge({ priority, className }: { priority: ProjectPriority; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", colors[priority], className)}>
      {priority}
    </span>
  );
}
