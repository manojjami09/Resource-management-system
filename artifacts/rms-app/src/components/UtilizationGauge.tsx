import { cn } from "@/lib/utils";

interface UtilizationGaugeProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

function getColor(value: number) {
  if (value >= 90) return { stroke: "#f43f5e", text: "text-red-500" };
  if (value >= 70) return { stroke: "#6366f1", text: "text-indigo-600" };
  if (value >= 40) return { stroke: "#10b981", text: "text-emerald-600" };
  return { stroke: "#94a3b8", text: "text-slate-400" };
}

const sizes = {
  sm: { svg: 48, r: 20, stroke: 4, font: "text-xs" },
  md: { svg: 80, r: 34, stroke: 6, font: "text-sm" },
  lg: { svg: 120, r: 50, stroke: 8, font: "text-base" },
};

export function UtilizationGauge({ value, size = "md", showLabel = true, className }: UtilizationGaugeProps) {
  const { svg, r, stroke, font } = sizes[size];
  const { stroke: strokeColor, text } = getColor(value);
  const center = svg / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - value / 100);

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <div className="relative inline-block">
        <svg width={svg} height={svg} className="-rotate-90">
          <circle cx={center} cy={center} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
          <circle
            cx={center} cy={center} r={r} fill="none"
            stroke={strokeColor} strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold rotate-0", font, text)}>{value}%</span>
        </div>
      </div>
      {showLabel && <span className="text-xs text-slate-500 mt-1">Utilization</span>}
    </div>
  );
}
