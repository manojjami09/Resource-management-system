import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  index?: number;
  loading?: boolean;
}

export function MetricCard({
  title, value, change, changeLabel, icon: Icon,
  iconColor = "text-indigo-600", iconBg = "bg-indigo-50",
  index = 0, loading = false,
}: MetricCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === undefined || change === 0;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
        <div className="h-8 bg-slate-200 rounded w-20 mb-2" />
        <div className="h-3 bg-slate-100 rounded w-16" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px -4px rgba(0,0,0,0.08)" }}
      data-testid={`metric-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
      className="bg-white rounded-xl border border-slate-200 p-5 cursor-default transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={cn("rounded-lg p-2", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-1.5">{value}</p>
      {change !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive && <TrendingUp className="h-3 w-3 text-emerald-600" />}
          {isNegative && <TrendingDown className="h-3 w-3 text-red-500" />}
          {isNeutral && <Minus className="h-3 w-3 text-slate-400" />}
          <span className={cn("text-xs font-medium",
            isPositive && "text-emerald-600",
            isNegative && "text-red-500",
            isNeutral && "text-slate-400",
          )}>
            {change > 0 ? "+" : ""}{change}% {changeLabel || "vs last month"}
          </span>
        </div>
      )}
    </motion.div>
  );
}
