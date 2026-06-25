import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  loading?: boolean;
  index?: number;
}

export function ChartCard({ title, subtitle, children, actions, className, loading = false, index = 0 }: ChartCardProps) {
  if (loading) {
    return (
      <div className={cn("bg-white rounded-xl border border-slate-200 p-5 animate-pulse", className)}>
        <div className="h-4 bg-slate-200 rounded w-32 mb-4" />
        <div className="h-48 bg-slate-100 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className={cn("bg-white rounded-xl border border-slate-200 p-5", className)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      {children}
    </motion.div>
  );
}
