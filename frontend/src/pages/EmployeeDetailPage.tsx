import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Employee, TimelineEvent, Allocation } from "../types";
import { getEmployee, getEmployeeTimeline, getEmployeeAllocations } from "../services/employeeService";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, Briefcase, Calendar, Mail, CheckCircle2, 
  PieChart, TrendingUp, DollarSign, Target 
} from "lucide-react";
import { motion } from "framer-motion";

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const emp = await getEmployee(id);
        if (emp) {
          setEmployee(emp);
          const [tl, allocs] = await Promise.all([
            getEmployeeTimeline(id),
            getEmployeeAllocations(id)
          ]);
          setTimeline(tl);
          setAllocations(allocs);
        } else {
          setLocation("/employees");
        }
      } catch (error) {
        console.error("Error loading employee details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id, setLocation]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-indigo-600 font-medium">Loading Profile...</span>
        </div>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-8"
    >
      <div className="flex items-center gap-4">
        <Link href="/employees">
          <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:shadow transition-all">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            {employee.name}
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {employee.designation}
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Left Profile Card */}
        <Card className="md:col-span-4 overflow-hidden border-none shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
          <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <CardContent className="pt-0 flex flex-col items-center text-center relative px-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="relative -mt-16 mb-4"
            >
              <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-950 shadow-2xl">
                <AvatarImage src={employee.avatar} alt={employee.name} className="object-cover" />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700">
                  {employee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{employee.name}</h2>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-3">{employee.employeeId}</p>
            
            <Badge 
              variant={employee.status === "ALLOCATED" ? "default" : "secondary"} 
              className="mb-8 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              {employee.status}
            </Badge>

            <div className="w-full space-y-5 text-sm text-left">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 transition-colors hover:border-indigo-200 dark:hover:border-indigo-900">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs text-muted-foreground font-medium">Email</span>
                  <span className="truncate font-medium text-slate-900 dark:text-slate-200" title={employee.email}>{employee.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 transition-colors hover:border-purple-200 dark:hover:border-purple-900">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <Target className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium">Department</span>
                  <span className="font-medium text-slate-900 dark:text-slate-200">{employee.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 transition-colors hover:border-blue-200 dark:hover:border-blue-900">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium">Joining Date</span>
                  <span className="font-medium text-slate-900 dark:text-slate-200">{new Date(employee.joiningDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              {employee.availableFrom && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30"
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-green-700 dark:text-green-500 font-medium">Available From</span>
                    <span className="font-bold text-green-800 dark:text-green-400">
                      {new Date(employee.availableFrom).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Details Section */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Allocation", value: `${employee.totalAllocationPercent}%`, icon: PieChart, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
              { label: "Experience", value: `${employee.experience} Years`, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
              { label: "Monthly Cost", value: employee.monthlyCost ? `₹${employee.monthlyCost.toLocaleString()}` : "Not Set", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 200 }}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                  <stat.icon className={`w-24 h-24 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className={`p-2.5 rounded-xl shadow-sm ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight relative z-10">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <Card className="flex-1 shadow-md border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-0">
              <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
                <TabsList className="w-full justify-start p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-6">
                  <TabsTrigger value="overview" className="rounded-lg px-6 font-medium">Overview</TabsTrigger>
                  <TabsTrigger value="skills" className="rounded-lg px-6 font-medium">Skills</TabsTrigger>
                  <TabsTrigger value="allocations" className="rounded-lg px-6 font-medium">History</TabsTrigger>
                  <TabsTrigger value="timeline" className="rounded-lg px-6 font-medium">Timeline</TabsTrigger>
                </TabsList>
                
                <div className="flex-1 pb-6">
                  <TabsContent value="overview" className="mt-0 h-full">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <FolderKanban className="h-5 w-5 text-indigo-500" /> Current Projects
                      </h3>
                      {employee.currentAllocations.length > 0 ? (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                          <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                              <TableRow>
                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Project</TableHead>
                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Allocation</TableHead>
                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Start Date</TableHead>
                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">End Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {employee.currentAllocations.map(a => (
                                <TableRow key={a.projectId + "-" + a.startDate} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                  <TableCell className="font-bold text-slate-900 dark:text-slate-100">{a.projectName}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                                      {a.allocationPercent}%
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">{new Date(a.startDate).toLocaleDateString()}</TableCell>
                                  <TableCell className="text-muted-foreground">{new Date(a.endDate).toLocaleDateString()}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
                          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                            <Briefcase className="h-6 w-6 text-slate-400" />
                          </div>
                          <p className="text-lg font-medium text-slate-900 dark:text-slate-100">No active allocations</p>
                          <p className="text-sm text-slate-500 mt-1 max-w-sm">This employee is currently completely unallocated and ready for a new project assignment.</p>
                        </div>
                      )}
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="skills" className="mt-0">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" /> Technical Skills
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {employee.skills.map((s, idx) => (
                          <motion.div 
                            key={idx} 
                            whileHover={{ y: -2, scale: 1.02 }}
                            className="flex flex-col gap-1 p-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
                          >
                            <span className="font-bold text-slate-900 dark:text-slate-100">{s.name}</span>
                            <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">{s.proficiencyLevel}</span>
                          </motion.div>
                        ))}
                        {employee.skills.length === 0 && (
                          <p className="text-muted-foreground italic">No technical skills have been recorded for this employee.</p>
                        )}
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="allocations" className="mt-0">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-500" /> Project History
                      </h3>
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <Table>
                          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                            <TableRow>
                              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Project Name</TableHead>
                              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Allocation</TableHead>
                              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Duration</TableHead>
                              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {allocations.map(a => (
                              <TableRow key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                <TableCell className="font-bold text-slate-900 dark:text-slate-100">{a.projectName}</TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
                                    {a.allocationPercent}%
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{new Date(a.startDate).toLocaleDateString()} - {new Date(a.endDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <Badge className={a.status === "active" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-slate-500 hover:bg-slate-600 text-white"}>
                                    {a.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                            {allocations.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic">
                                  No previous allocation history found.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-0">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pl-2">
                      <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                        <Calendar className="h-5 w-5 text-pink-500" /> Activity Timeline
                      </h3>
                      <div className="space-y-8 pl-4 border-l-2 border-slate-200 dark:border-slate-700 relative">
                        {timeline.map((event, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative pl-6 group"
                          >
                            <div className="absolute -left-[29px] top-1.5 h-4 w-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-white dark:border-slate-900 group-hover:bg-indigo-500 group-hover:scale-125 transition-all shadow-sm"></div>
                            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm group-hover:shadow-md group-hover:border-indigo-100 dark:group-hover:border-indigo-900/50 transition-all">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <h4 className="font-bold text-slate-900 dark:text-white">{event.title}</h4>
                                <Badge variant="outline" className="w-fit text-[10px] text-slate-500 dark:text-slate-400">
                                  {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{event.description}</p>
                            </div>
                          </motion.div>
                        ))}
                        {timeline.length === 0 && (
                          <p className="text-muted-foreground italic pl-4">No timeline events have been logged yet.</p>
                        )}
                      </div>
                    </motion.div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
