import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { useEmployees } from "../hooks/useEmployees";
import { useDebounce } from "../hooks/useDebounce";
import { EmployeePanel } from "../components/EmployeePanel";
import { StatusBadge } from "../components/StatusBadge";
import { SkillBadgeList } from "../components/SkillBadge";
import { Employee, EmployeeStatus } from "../types";
import { formatDate } from "../utils/format";
import { cn } from "@/lib/utils";
import { DEPARTMENTS, LOCATIONS } from "../constants";

const PAGE_SIZE = 25;

type SortKey = "employeeName" | "designation" | "department" | "experience" | "utilization" | "status";
type SortDir = "asc" | "desc";

export function EmployeesPage() {
  const { employees, loading } = useEmployees();
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("employeeName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<EmployeeStatus[]>([]);
  const [filterDept, setFilterDept] = useState<string[]>([]);
  const [filterUtilMin, setFilterUtilMin] = useState(0);

  const debouncedSearch = useDebounce(search, 250);

  const filtered = useMemo(() => {
    let data = [...employees];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      data = data.filter((e) =>
        e.employeeName.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (filterStatus.length) data = data.filter((e) => filterStatus.includes(e.status));
    if (filterDept.length) data = data.filter((e) => filterDept.includes(e.department));
    if (filterUtilMin > 0) data = data.filter((e) => e.utilization >= filterUtilMin);

    data.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return data;
  }, [employees, debouncedSearch, filterStatus, filterDept, filterUtilMin, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
      : <ChevronUp className="h-3 w-3 opacity-20" />;

  const toggleStatus = (s: EmployeeStatus) =>
    setFilterStatus((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const toggleDept = (d: string) =>
    setFilterDept((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  if (loading) return (
    <div className="p-6">
      <div className="h-10 bg-slate-200 rounded-lg w-64 mb-6 animate-pulse" />
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded mb-2 animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Employees</h1>
          <p className="text-sm text-slate-500">{filtered.length} of {employees.length} resources</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              data-testid="input-employee-search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search employees, skills, dept..."
              className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm w-72 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
            />
          </div>
          <button
            data-testid="button-filters"
            onClick={() => setShowFilters(!showFilters)}
            className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
              showFilters ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {(filterStatus.length + filterDept.length > 0) && (
              <span className="h-5 w-5 rounded-full bg-white text-indigo-600 text-xs font-bold flex items-center justify-center">
                {filterStatus.length + filterDept.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {(["active", "bench", "available", "on-leave"] as EmployeeStatus[]).map((s) => (
                  <button
                    key={s}
                    data-testid={`filter-status-${s}`}
                    onClick={() => { toggleStatus(s); setPage(1); }}
                    className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize",
                      filterStatus.includes(s) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    )}
                  >
                    {s.split("-").join(" ")}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Department</p>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.slice(0, 5).map((d) => (
                  <button
                    key={d}
                    onClick={() => { toggleDept(d); setPage(1); }}
                    className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                      filterDept.includes(d) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Min Utilization: {filterUtilMin}%
              </p>
              <input
                type="range" min={0} max={100} step={10}
                value={filterUtilMin}
                onChange={(e) => { setFilterUtilMin(Number(e.target.value)); setPage(1); }}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
          <button
            onClick={() => { setFilterStatus([]); setFilterDept([]); setFilterUtilMin(0); setPage(1); }}
            className="mt-3 text-xs text-slate-500 hover:text-red-500 transition-colors"
          >
            Clear all filters
          </button>
        </motion.div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="employees-table">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {[
                  { label: "Employee", key: "employeeName" },
                  { label: "Designation", key: "designation" },
                  { label: "Department", key: "department" },
                  { label: "Skills", key: null },
                  { label: "Exp", key: "experience" },
                  { label: "Utilization", key: "utilization" },
                  { label: "Status", key: "status" },
                  { label: "Available", key: null },
                ].map(({ label, key }) => (
                  <th
                    key={label}
                    className={cn("px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap", key && "cursor-pointer hover:text-slate-800 select-none")}
                    onClick={() => key && handleSort(key as SortKey)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {key && <SortIcon k={key as SortKey} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((emp, i) => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelectedEmployee(emp)}
                  data-testid={`row-employee-${emp.id}`}
                  className="border-b border-slate-50 hover:bg-indigo-50/30 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={emp.avatar} alt={emp.employeeName} className="h-8 w-8 rounded-full bg-slate-100 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">{emp.employeeName}</p>
                        <p className="text-xs text-slate-400">{emp.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{emp.designation}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{emp.department}</td>
                  <td className="px-4 py-3"><SkillBadgeList skills={emp.skills} max={2} /></td>
                  <td className="px-4 py-3 text-slate-600 text-xs text-center">{emp.experience}y</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 min-w-20">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", emp.utilization >= 90 ? "bg-red-400" : emp.utilization >= 70 ? "bg-indigo-500" : emp.utilization > 0 ? "bg-emerald-400" : "bg-slate-200")}
                          style={{ width: `${emp.utilization}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600 w-8">{emp.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{formatDate(emp.availabilityDate)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              data-testid="pagination-prev"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page + i - 2;
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn("h-7 w-7 rounded-md text-xs font-medium transition-colors",
                    p === page ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {p}
                </button>
              );
            })}
            <button
              data-testid="pagination-next"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <EmployeePanel employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
    </div>
  );
}
