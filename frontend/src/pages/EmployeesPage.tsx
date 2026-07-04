import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, User, Briefcase, Calendar } from "lucide-react";
import { getEmployees, getBenchEmployees, getSkillMatrix, getMe } from "../services/employeeService";
import { useDebounce } from "../hooks/useDebounce";
import { StatusBadge } from "../components/StatusBadge";
import { SkillBadgeList } from "../components/SkillBadge";
import { Employee, EmployeeStatus, SkillMatrixData } from "../types";
import { formatDate } from "../utils/format";
import { cn } from "@/lib/utils";
import { DEPARTMENTS } from "../constants";
import { useAuth } from "../context/AuthContext";
import { AddEmployeeModal } from "../components/AddEmployeeModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PAGE_SIZE = 25;

type SortKey = "name" | "designation" | "department" | "experience" | "utilizationPercent" | "status";
type SortDir = "asc" | "desc";

export function EmployeesPage() {
  const [, setLocation] = useLocation();
  const { role } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [skillMatrix, setSkillMatrix] = useState<SkillMatrixData | null>(null);
  const [myProfile, setMyProfile] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<EmployeeStatus[]>([]);
  const [filterDept, setFilterDept] = useState<string[]>([]);
  const [filterUtilMin, setFilterUtilMin] = useState(0);

  const debouncedSearch = useDebounce(search, 250);

  const loadData = async () => {
    setLoading(true);
    try {
      if (role === "ROLE_EMPLOYEE") {
        const me = await getMe();
        setMyProfile(me);
      } else {
        const [all, avail, matrix] = await Promise.all([
          getEmployees(),
          getBenchEmployees(),
          getSkillMatrix()
        ]);
        setEmployees(all);
        setAvailableEmployees(avail);
        setSkillMatrix(matrix);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getFilteredAndSorted = (dataToFilter: Employee[]) => {
    let data = [...dataToFilter];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      data = data.filter((e) =>
        e.name.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.skills.some((s) => s.name.toLowerCase().includes(q))
      );
    }
    if (filterStatus.length) data = data.filter((e) => filterStatus.includes(e.status));
    if (filterDept.length) data = data.filter((e) => filterDept.includes(e.department));
    if (filterUtilMin > 0) data = data.filter((e) => e.utilizationPercent >= filterUtilMin);

    data.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return data;
  };

  const filteredAll = useMemo(() => getFilteredAndSorted(employees), [employees, debouncedSearch, filterStatus, filterDept, filterUtilMin, sortKey, sortDir]);
  const filteredAvail = useMemo(() => getFilteredAndSorted(availableEmployees), [availableEmployees, debouncedSearch, filterStatus, filterDept, filterUtilMin, sortKey, sortDir]);

  const totalPagesAll = Math.ceil(filteredAll.length / PAGE_SIZE);
  const pagedAll = filteredAll.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalPagesAvail = Math.ceil(filteredAvail.length / PAGE_SIZE);
  const pagedAvail = filteredAvail.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

  const renderTable = (paged: Employee[], filteredLen: number, totalPages: number) => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="employees-table">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {[
                  { label: "Employee", key: "name" },
                  { label: "Designation", key: "designation" },
                  { label: "Department", key: "department" },
                  { label: "Skills", key: null },
                  { label: "Exp", key: "experience" },
                  { label: "Utilization", key: "utilizationPercent" },
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
                  onClick={() => setLocation(`/employees/${emp.id}`)}
                  className="border-b border-slate-50 hover:bg-indigo-50/30 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={emp.avatar} alt={emp.name} className="h-8 w-8 rounded-full bg-slate-100 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-400">{emp.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{emp.designation}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{emp.department}</td>
                  <td className="px-4 py-3"><SkillBadgeList skills={emp.skills.map(s => s.name)} max={2} /></td>
                  <td className="px-4 py-3 text-slate-600 text-xs text-center">{emp.experience}y</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 min-w-20">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", emp.utilizationPercent >= 90 ? "bg-red-400" : emp.utilizationPercent >= 70 ? "bg-indigo-500" : emp.utilizationPercent > 0 ? "bg-emerald-400" : "bg-slate-200")}
                          style={{ width: `${emp.utilizationPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600 w-8">{emp.utilizationPercent}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{emp.availableFrom ? formatDate(emp.availableFrom) : '-'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredLen)}–{Math.min(page * PAGE_SIZE, filteredLen)} of {filteredLen}
          </p>
          <div className="flex items-center gap-1">
            <button
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
  );

  if (role === "ROLE_EMPLOYEE") {
    if (!myProfile) return <div className="p-6">Failed to load profile.</div>;
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <img src={myProfile.avatar} alt={myProfile.name} className="h-24 w-24 rounded-full border-4 border-white bg-slate-100 shadow-md" />
              <StatusBadge status={myProfile.status} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{myProfile.name}</h2>
              <p className="text-slate-500">{myProfile.designation} • {myProfile.department}</p>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><User className="h-4 w-4 text-slate-400"/> About</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-50"><span className="text-slate-500">Employee ID</span><span className="font-medium">{myProfile.employeeId}</span></div>
                    <div className="flex justify-between py-2 border-b border-slate-50"><span className="text-slate-500">Email</span><span className="font-medium">{myProfile.email}</span></div>
                    <div className="flex justify-between py-2 border-b border-slate-50"><span className="text-slate-500">Experience</span><span className="font-medium">{myProfile.experience} years</span></div>
                    <div className="flex justify-between py-2 border-b border-slate-50"><span className="text-slate-500">Joining Date</span><span className="font-medium">{formatDate(myProfile.joiningDate)}</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><Briefcase className="h-4 w-4 text-slate-400"/> Current Allocation</h3>
                  {myProfile.currentAllocations && myProfile.currentAllocations.length > 0 ? (
                    <div className="space-y-3">
                      {myProfile.currentAllocations.map((alloc: any) => (
                        <div key={alloc.projectId} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <p className="font-medium text-slate-900">{alloc.projectName}</p>
                          <div className="flex justify-between mt-2 text-xs text-slate-500">
                            <span>{alloc.allocationPercent}% Allocated</span>
                            <span>Ends {formatDate(alloc.endDate)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Currently not allocated to any projects.</p>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-slate-400"/> Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {myProfile.skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                        {s.name} <span className="opacity-60 ml-1">({s.proficiencyLevel})</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400"/> Utilization</h3>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 font-medium">Total Utilization</span>
                      <span className="text-lg font-bold text-slate-900">{myProfile.utilizationPercent}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", myProfile.utilizationPercent >= 100 ? "bg-red-500" : myProfile.utilizationPercent >= 75 ? "bg-emerald-500" : "bg-indigo-500")}
                        style={{ width: `${Math.min(100, myProfile.utilizationPercent)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search employees..."
              className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm w-72 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
            />
          </div>
          <button
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
          
          {(role === "ROLE_ADMIN" || role === "ROLE_MANAGER") && (
            <AddEmployeeModal onSuccess={() => { setPage(1); loadData(); }} />
          )}
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
                {(["ALLOCATED", "BENCH", "ON_LEAVE"] as EmployeeStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => { toggleStatus(s); setPage(1); }}
                    className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize",
                      filterStatus.includes(s) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    )}
                  >
                    {s.split("_").join(" ")}
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

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all" onClick={() => setPage(1)}>All Employees</TabsTrigger>
          <TabsTrigger value="available" onClick={() => setPage(1)}>Available (30 Days)</TabsTrigger>
          <TabsTrigger value="matrix">Skill Matrix</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {renderTable(pagedAll, filteredAll.length, totalPagesAll)}
        </TabsContent>
        
        <TabsContent value="available" className="space-y-4">
          {renderTable(pagedAvail, filteredAvail.length, totalPagesAvail)}
        </TabsContent>
        
        <TabsContent value="matrix" className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 overflow-auto">
            {skillMatrix && skillMatrix.skills.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Employee</TableHead>
                    {skillMatrix.skills.map(s => (
                      <TableHead key={s.id} className="text-center">{s.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skillMatrix.employees.map((emp, i) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      {skillMatrix.matrix[i].map((prof, j) => (
                        <TableCell key={j} className="text-center">
                          {prof ? (
                            <span className={cn("px-2 py-1 rounded text-xs font-medium", 
                              prof === "EXPERT" ? "bg-purple-100 text-purple-700" :
                              prof === "INTERMEDIATE" ? "bg-blue-100 text-blue-700" :
                              "bg-slate-100 text-slate-700"
                            )}>
                              {prof}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-8">No skills data available.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
