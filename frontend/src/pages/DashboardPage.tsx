import { useDashboard } from "../hooks/useDashboard";
import { MetricCard } from "../components/MetricCard";
import { ChartCard } from "../components/ChartCard";
import { StatusBadge } from "../components/StatusBadge";
import { SkillBadgeList } from "../components/SkillBadge";
import { formatCurrency, formatDate, getDaysUntil, timeAgo } from "../utils/format";
import { motion } from "framer-motion";
import {
  Users, BarChart3, FolderKanban, TrendingUp, DollarSign, Inbox,
  AlertCircle, AlertTriangle, Info, Zap,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/AuthContext";

const CHART_COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#f43f5e"];

const insightIconMap = {
  critical: { icon: AlertCircle, cls: "text-red-500 bg-red-50 border-red-100" },
  warning: { icon: AlertTriangle, cls: "text-amber-600 bg-amber-50 border-amber-100" },
  info: { icon: Info, cls: "text-blue-600 bg-blue-50 border-blue-100" },
};

export function DashboardPage() {
  const { role } = useAuth();
  const { stats, myProfile, myProjects, managerSummary, loading } = useDashboard();

  const kpiCards = stats ? [
    { title: "Total Employees", value: stats.totalEmployees, change: 3.2, icon: Users, iconColor: "text-indigo-600", iconBg: "bg-indigo-50" },
    { title: "Bench %", value: `${Number(stats.benchPercent || 0).toFixed(1)}%`, change: -1.7, icon: BarChart3, iconColor: "text-amber-600", iconBg: "bg-amber-50" },
    { title: "Active Projects", value: stats.activeProjects, change: 5.1, icon: FolderKanban, iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
    { title: "Avg Utilization", value: `${Number(stats.avgUtilization || 0).toFixed(1)}%`, change: 3.0, icon: TrendingUp, iconColor: "text-blue-600", iconBg: "bg-blue-50" }
  ] : [];

  if (role === "ROLE_EMPLOYEE") {
    return (
      <div className="p-6 space-y-6 max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard title="My Utilization" value={myProfile ? `${myProfile.utilizationPercent}%` : "0%"} icon={TrendingUp} iconColor="text-blue-600" iconBg="bg-blue-50" />
          <MetricCard title="My Projects" value={myProjects?.length || 0} icon={FolderKanban} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">My Allocation Timeline</h2>
          {myProfile?.currentAllocations && myProfile.currentAllocations.length > 0 ? (
            <div className="space-y-4">
              {myProfile.currentAllocations.map((alloc: any) => (
                <div key={alloc.projectId} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div>
                    <h3 className="font-semibold text-slate-800">{alloc.projectName}</h3>
                    <p className="text-sm text-slate-500">From {formatDate(alloc.startDate)} to {formatDate(alloc.endDate)}</p>
                  </div>
                  <div className="mt-3 md:mt-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {alloc.allocationPercent}% Allocated
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-slate-500 italic">No current project allocations.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <MetricCard key={i} title="" value="" icon={Users} loading index={i} />)
          : kpiCards.map((card, i) => <MetricCard key={card.title} {...card} index={i} />)
        }
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Utilization Trend" subtitle="12-month rolling average" className="lg:col-span-2" loading={loading} index={0}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats?.utilizationHistory?.map((d) => ({ ...d, name: d.month, utilization: d.value })) || []}>
              <defs>
                <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[60, 95]} unit="%" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Area type="monotone" dataKey="utilization" stroke="#6366f1" strokeWidth={2.5} fill="url(#utilGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Project Status" subtitle="Current distribution" loading={loading} index={1}>
          <div className="flex items-center justify-center h-[220px] text-sm text-slate-400">Data not available</div>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Capacity vs Demand" subtitle="Monthly resource balance" loading={loading} index={2}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats?.capacityVsDemand?.map((d) => ({ name: d.month, Capacity: d.capacity, Demand: d.demand })) || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Capacity" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Demand" fill="#818cf8" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Utilization" subtitle="By department headcount" loading={loading} index={3}>
          <div className="flex items-center justify-center h-[200px] text-sm text-slate-400">Data not available</div>
        </ChartCard>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* AI Insights */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-slate-800">AI Manager Insights</h3>
          </div>
          <div className="space-y-3">
            {loading ? (
               <div className="h-16 bg-slate-100 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-start gap-3 rounded-lg border p-3 text-sm text-slate-700 bg-indigo-50/50 border-indigo-100">
                <div dangerouslySetInnerHTML={{ __html: managerSummary.replace(/\n/g, '<br/>') }} />
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {(loading ? [] : stats?.recentActivity ?? []).map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3"
              >
                <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {a.avatar?.startsWith('http') ? (
                    <img src={a.avatar} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-indigo-600">{a.avatar}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 leading-snug">{a.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{timeAgo(a.timestamp)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Rolloffs */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Upcoming Roll-offs</h3>
          <div className="space-y-3">
            {(loading ? [] : stats?.upcomingRolloffs ?? []).map((r, i) => (
              <motion.div
                key={r.employeeId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {r.avatar?.startsWith('http') ? (
                    <img src={r.avatar} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-indigo-600">{r.avatar}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{r.employeeName}</p>
                  <p className="text-xs text-slate-500 truncate">{r.projectName}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={cn("text-xs font-medium", getDaysUntil(r.rolloffDate) <= 14 ? "text-red-600" : "text-amber-600")}>
                      {getDaysUntil(r.rolloffDate)}d remaining
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{formatDate(r.rolloffDate)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
