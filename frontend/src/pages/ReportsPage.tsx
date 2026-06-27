import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Mail, RefreshCw, CheckCircle, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { getMonthlyUtilizationReport, getProjectSummaryReport, getBenchReport, getForecastReport, exportReport } from "../services/reportService";
import { Report, ReportFormat } from "../types";
import { formatDate } from "../utils/format";
import { cn } from "@/lib/utils";

const REPORT_DEFS = [
  { id: "utilization", title: "Monthly Utilization Report", description: "Avg utilization, billable counts, department breakdown", icon: TrendingUp, color: "indigo", fetcher: getMonthlyUtilizationReport },
  { id: "project", title: "Project Summary Report", description: "Project status, health, completion, and budget burn", icon: FileText, color: "emerald", fetcher: getProjectSummaryReport },
  { id: "bench", title: "Bench Resource Report", description: "Idle resources, bench aging, cost impact", icon: TrendingDown, color: "amber", fetcher: getBenchReport },
  { id: "forecast", title: "Resource Demand Forecast", description: "Q3–Q4 demand projections and hiring recommendations", icon: TrendingUp, color: "purple", fetcher: getForecastReport },
];

const colorMap: Record<string, { icon: string; badge: string }> = {
  indigo: { icon: "bg-indigo-100 text-indigo-600", badge: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  emerald: { icon: "bg-emerald-100 text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  amber: { icon: "bg-amber-100 text-amber-600", badge: "bg-amber-50 text-amber-700 border-amber-100" },
  purple: { icon: "bg-purple-100 text-purple-600", badge: "bg-purple-50 text-purple-700 border-purple-100" },
};

export function ReportsPage() {
  const [reports, setReports] = useState<Record<string, Report | null>>({});
  const [loading, setLoading] = useState<Set<string>>(new Set(["utilization", "project", "bench", "forecast"]));
  const [exporting, setExporting] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState("utilization");

  useEffect(() => {
    REPORT_DEFS.forEach(({ id, fetcher }) => {
      fetcher().then((data) => {
        setReports((prev) => ({ ...prev, [id]: data }));
        setLoading((prev) => { const next = new Set(prev); next.delete(id); return next; });
      });
    });
  }, []);

  const handleExport = async (reportId: string, format: ReportFormat) => {
    setExporting(`${reportId}-${format}`);
    await exportReport(reportId, format);
    setTimeout(() => setExporting(null), 1500);
  };

  const current = reports[activeReport];
  const isLoading = loading.has(activeReport);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-sm text-slate-500">Generate, view, and export detailed resource management reports</p>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {REPORT_DEFS.map(({ id, title, description, icon: Icon, color }, i) => {
          const { icon: iconCls, badge } = colorMap[color];
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -2 }}
              onClick={() => setActiveReport(id)}
              data-testid={`report-card-${id}`}
              className={cn(
                "bg-white rounded-xl border p-5 cursor-pointer transition-all",
                activeReport === id ? "border-indigo-400 ring-2 ring-indigo-100 shadow-sm" : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
              )}
            >
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-3", iconCls)}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">{title}</h3>
              <p className="text-xs text-slate-500 mb-3">{description}</p>
              {loading.has(id) ? (
                <div className="h-3.5 bg-slate-100 rounded w-24 animate-pulse" />
              ) : (
                <div className={cn("text-xs px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5", badge)}>
                  <CheckCircle className="h-3 w-3" />
                  Ready
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Report detail */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Generating report...</p>
            </div>
          </div>
        ) : current ? (
          <>
            {/* Report header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-0.5">{current.title}</h2>
                <p className="text-sm text-slate-500 mb-1">{current.description}</p>
                <p className="text-xs text-slate-400">Last generated: {formatDate(current.lastGenerated)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExport(activeReport, "excel")}
                  disabled={exporting !== null}
                  data-testid="btn-export-excel"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60"
                >
                  {exporting === `${activeReport}-excel` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Excel
                </button>
                <button
                  onClick={() => handleExport(activeReport, "pdf")}
                  disabled={exporting !== null}
                  data-testid="btn-export-pdf"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {exporting === `${activeReport}-pdf` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  PDF
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {current.metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-slate-50 rounded-xl border border-slate-100 p-4"
                >
                  <p className="text-xs text-slate-500 mb-1">{m.label}</p>
                  <p className="text-xl font-bold text-slate-900">{m.value}</p>
                  {m.change && <p className="text-xs text-slate-400 mt-0.5">{m.change}</p>}
                </motion.div>
              ))}
            </div>

            {/* Data table */}
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-sm" data-testid={`report-table-${activeReport}`}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {current.tableColumns.map((col) => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {current.tableData.map((row, ri) => (
                    <motion.tr
                      key={ri}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: ri * 0.04 }}
                      className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                    >
                      {current.tableColumns.map((col) => (
                        <td key={col} className="px-4 py-3 text-slate-700 whitespace-nowrap">{String(row[col] ?? "")}</td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
