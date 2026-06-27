import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  skill: string;
  variant?: "default" | "muted" | "gap";
  className?: string;
}

export function SkillBadge({ skill, variant = "default", className }: SkillBadgeProps) {
  return (
    <span
      data-testid={`skill-badge-${skill}`}
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variant === "default" && "bg-indigo-50 text-indigo-700 border border-indigo-100",
        variant === "muted" && "bg-slate-100 text-slate-600 border border-slate-200",
        variant === "gap" && "bg-red-50 text-red-700 border border-red-100",
        className
      )}
    >
      {skill}
    </span>
  );
}

interface SkillBadgeListProps {
  skills: string[];
  max?: number;
  variant?: "default" | "muted" | "gap";
}

export function SkillBadgeList({ skills, max = 3, variant = "default" }: SkillBadgeListProps) {
  const shown = skills.slice(0, max);
  const remaining = skills.length - max;
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((s) => <SkillBadge key={s} skill={s} variant={variant} />)}
      {remaining > 0 && (
        <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
          +{remaining}
        </span>
      )}
    </div>
  );
}
