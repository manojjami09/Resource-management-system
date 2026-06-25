import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, Info, TrendingUp, TrendingDown } from "lucide-react";
import { getSkillGapAnalytics } from "../services/analyticsService";
import { SkillGapData } from "../types";
import { ChartCard } from "../components/ChartCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import { cn } from "@/lib/utils";

const severityConfig = {
  critical: { icon: AlertCircle, cls: "text-red-600 bg-red-50 border-red-200", label: "Critical" },
  high: { icon: AlertTriangle, cls: "text-amber-600 bg-amber-50 border-amber-200", label: "High" },
  medium: { icon: Info, cls: "text-blue-600 bg-blue-50 border-blue-200", label: "Medium" },
};

const DEPT_COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];
const LINE_COLORS = { react: "#6366f1", java: "#3b82f6", aws: "#10b981", python: "#f59e0b", kubernetes: "#f43f5e" };

export function SkillGapPage() {
  const [data, setData] = useState<SkillGapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"gap" | "forecast" | "heatmap">("gap");

  useEffect(() => {
    getSkillGapAnalytics().then((d) => { setData(d); setLoading(false); });
  }, []);

  return (
    <div className="p-6 space-y-5">
      <div className="mb-1">
        <h1 className="text-lg font-bold text-slate-900">Skill Gap Analytics</h1>
        <p className="text-sm text-slate-500">Demand vs. supply analysis with forecasting and department heatmap</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {[{ key: "gap", label: "Gap Analysis" }, { key: "forecast", label: "Demand Forecast" }, { key: "heatmap", label: "Dept. Heatmap" }].map(({ key, label }) => (
          <button
            key={key}
            data-testid={`tab-skill-${key}`}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === key ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-800"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "gap" && (
        <div className="space-y-5">
          {/* Top missing skills */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Critical Skill Gaps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(loading ? [] : data?.topMissingSkills ?? []).map((gap, i) => {
                const { icon: Icon, cls, label } = severityConfig[gap.severity];
                return (
                  <motion.div
                    key={gap.skill}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    data-testid={`skill-gap-${gap.skill.toLowerCase().replace(/\s+/g, "-")}`}
                    className={cn("rounded-xl border p-4", cls)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-semibold">{gap.skill}</span>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/60 border border-current border-opacity-20">
                        {label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <p className="opacity-60">Required</p>
                        <p className="font-bold text-lg leading-tight">{gap.required}</p>
                      </div>
                      <div>
                        <p className="opacity-60">Available</p>
                        <p className="font-bold text-lg leading-tight">{gap.available}</p>
                      </div>
                      <div className="ml-auto">
                        <p className="opacity-60">Gap</p>
                        <div className="flex items-center gap-1">
                          <TrendingDown className="h-3.5 w-3.5" />
                          <span className="font-bold text-lg leading-tight">{gap.gap}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Required vs Available bar chart */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ChartCard title="Required vs Available by Skill" subtitle="All active project requirements" loading={loading}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data?.requiredVsAvailable ?? []} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="skill" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="required" fill="#6366f1" radius={[0, 3, 3, 0]} name="Required" />
                  <Bar dataKey="available" fill="#a5b4fc" radius={[0, 3, 3, 0]} name="Available" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Skill distribution donut */}
            <ChartCard title="Skill Distribution" subtitle="By practice area" loading={loading}>
              <div className="space-y-3 mt-2">
                {(data?.skillDistribution ?? []).map((item, i) => (
                  <div key={item.category} className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DEPT_COLORS[i % DEPT_COLORS.length] }} />
                    <span className="text-xs text-slate-600 w-24">{item.category}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / 32) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: DEPT_COLORS[i % DEPT_COLORS.length] }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 w-6">{item.count}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {activeTab === "forecast" && (
        <div className="space-y-4">
          <ChartCard title="Skill Demand Forecast" subtitle="Projected requirements for Q3–Q4 2025" loading={loading}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data?.demandForecast ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                {(Object.keys(LINE_COLORS) as (keyof typeof LINE_COLORS)[]).map((key) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={LINE_COLORS[key]} strokeWidth={2.5} dot={false} name={key.charAt(0).toUpperCase() + key.slice(1)} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Forecast summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(LINE_COLORS).map(([skill, color], i) => {
              const last = data?.demandForecast.at(-1);
              const val = last?.[skill as keyof typeof last] as number ?? 0;
              return (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-xl border border-slate-200 p-4"
                >
                  <div className="h-1.5 rounded-full mb-3" style={{ backgroundColor: color }} />
                  <p className="text-xs text-slate-500 capitalize mb-0.5">{skill}</p>
                  <p className="text-xl font-bold text-slate-900">{val}</p>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 mt-0.5">
                    <TrendingUp className="h-3 w-3" /> Demand rising
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "heatmap" && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Department Skill Coverage Heatmap</h3>
          <p className="text-xs text-slate-500 mb-5">Coverage % by skill category and department</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-slate-500 font-semibold py-2 pr-4 w-40">Department</th>
                  {["React", "Java", "Python", "AWS", "Kubernetes", "DevOps"].map((h) => (
                    <th key={h} className="text-center text-slate-500 font-semibold py-2 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(loading ? [] : data?.departmentHeatmap ?? []).map((row, i) => {
                  const cells = [row.react, row.java, row.python, row.aws, row.kubernetes, row.devops];
                  return (
                    <motion.tr
                      key={row.dept}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="border-b border-slate-50"
                    >
                      <td className="py-3 pr-4 font-medium text-slate-700">{row.dept}</td>
                      {cells.map((val, ci) => {
                        const heat = val >= 80 ? "bg-indigo-600 text-white" : val >= 60 ? "bg-indigo-200 text-indigo-800" : val >= 40 ? "bg-amber-100 text-amber-700" : "bg-red-50 text-red-600";
                        return (
                          <td key={ci} className="py-3 px-3 text-center">
                            <span className={cn("inline-block w-12 py-1 rounded-md font-semibold", heat)}>
                              {val}%
                            </span>
                          </td>
                        );
                      })}
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-indigo-600 inline-block" /> ≥80% Excellent</div>
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-indigo-200 inline-block" /> 60–79% Good</div>
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-100 inline-block" /> 40–59% Needs Attention</div>
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-red-50 inline-block" /> &lt;40% Critical Gap</div>
          </div>
        </div>
      )}
    </div>
  );
}
