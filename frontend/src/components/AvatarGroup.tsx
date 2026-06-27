import { getInitials } from "../utils/format";
import { cn } from "@/lib/utils";

interface AvatarGroupProps {
  names: string[];
  max?: number;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
};

const colors = [
  "bg-indigo-500", "bg-purple-500", "bg-blue-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500", "bg-cyan-500", "bg-pink-500",
];

export function AvatarGroup({ names, max = 4, size = "md" }: AvatarGroupProps) {
  const shown = names.slice(0, max);
  const remaining = names.length - max;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((name, i) => (
        <div
          key={name + i}
          title={name}
          className={cn(
            "rounded-full border-2 border-white flex items-center justify-center font-semibold text-white ring-0",
            sizeClasses[size],
            colors[i % colors.length],
          )}
        >
          {getInitials(name)}
        </div>
      ))}
      {remaining > 0 && (
        <div className={cn("rounded-full border-2 border-white flex items-center justify-center bg-slate-200 text-slate-600 font-semibold", sizeClasses[size])}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
