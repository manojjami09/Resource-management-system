export type EmployeeStatus = "active" | "bench" | "available" | "on-leave";
export type ProjectStatus = "active" | "planning" | "completed" | "on-hold";
export type AllocationStatus = "active" | "upcoming" | "completed";
export type ProjectHealth = "green" | "yellow" | "red";
export type ProjectPriority = "critical" | "high" | "medium" | "low";
export type RiskLevel = "low" | "medium" | "high";
export type NotificationType = "rolloff" | "bench_alert" | "skill_alert" | "request" | "delay";
export type NotificationPriority = "high" | "medium" | "low";
export type SkillSeverity = "critical" | "high" | "medium";
export type ReportFormat = "excel" | "pdf";

export interface EmployeeSkill {
  id: string;
  name: string;
  proficiencyLevel: "BEGINNER" | "INTERMEDIATE" | "EXPERT";
}

export interface CurrentAllocation {
  projectId: string;
  projectName: string;
  allocationPercent: number;
  startDate: string;
  endDate: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  avatar: string;
  designation: string;
  department: string;
  status: EmployeeStatus;
  joiningDate: string;
  experience: number;
  skills: EmployeeSkill[];
  totalAllocationPercent: number;
  utilizationPercent: number;
  availableFrom: string | null;
  currentAllocations: CurrentAllocation[];
  monthlyCost?: number;
  
  phone?: string;
  location?: string;
  manager?: string;
}

export interface Project {
  id: string;
  projectId: string;
  projectName: string;
  client: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  department: string;
  requiredSkills: string[];
  teamSize: number;
  allocatedSize: number;
  billedAmount: number;
  completionPercent: number;
  health: ProjectHealth;
  priority: ProjectPriority;
  description: string;
  budget?: number;
  milestones: Milestone[];
  vacantPositions: number;
  riskLevel: RiskLevel;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Milestone {
  name: string;
  date: string;
  completed: boolean;
}

export interface Allocation {
  id: string;
  employeeId: string;
  employeeName: string;
  projectId: string;
  projectName: string;
  startDate: string;
  endDate: string;
  allocationPercent: number;
  role: string;
  status: AllocationStatus;
  billable: boolean;
}

export interface AllocationRequest {
  id: string;
  projectId: string;
  projectName: string;
  client: string;
  requiredSkills: string[];
  experienceNeeded: number;
  priority: ProjectPriority;
  requestDate: string;
  startDate: string;
  role: string;
  description: string;
}

export interface SuggestedEmployee {
  employee: Employee;
  matchPercent: number;
  matchReasons: string[];
  availableIn: number;
  skillMatch: string[];
  skillGap: string[];
}

export interface DashboardStats {
  totalEmployees: number;
  benchCount: number;
  benchPercent: number;
  activeProjects: number;
  avgUtilization: number;
  openRequests: number;
  revenueThisMonth: number;
  revenueGrowth: number;
  utilizationHistory: MonthData[];
  capacityVsDemand: CapacityData[];
  benchTrend: MonthData[];
  departmentUtilization: DeptUtilization[];
  projectStatusBreakdown: StatusCount[];
  recentActivity: ActivityItem[];
  upcomingRolloffs: RolloffItem[];
  aiInsights: AIInsight[];
}

export interface MonthData {
  month: string;
  value: number;
}

export interface CapacityData {
  month: string;
  capacity: number;
  demand: number;
}

export interface DeptUtilization {
  dept: string;
  utilization: number;
  headcount: number;
}

export interface StatusCount {
  status: string;
  count: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: "allocation" | "rolloff" | "project" | "employee" | "report";
  message: string;
  timestamp: string;
  avatar: string;
  user: string;
}

export interface RolloffItem {
  employeeId: string;
  employeeName: string;
  avatar: string;
  projectName: string;
  rolloffDate: string;
  skills: string[];
  utilization: number;
  department: string;
}

export interface AIInsight {
  id: string;
  message: string;
  priority: "critical" | "warning" | "info";
  category: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: NotificationPriority;
  actionUrl: string | null;
}

export interface SkillGapData {
  requiredVsAvailable: SkillComparison[];
  topMissingSkills: MissingSkill[];
  skillDistribution: SkillCategory[];
  demandForecast: DemandForecastItem[];
  departmentHeatmap: DeptHeatmapRow[];
}

export interface SkillComparison {
  skill: string;
  required: number;
  available: number;
}

export interface MissingSkill {
  skill: string;
  gap: number;
  severity: SkillSeverity;
  required: number;
  available: number;
}

export interface SkillCategory {
  category: string;
  count: number;
}

export interface DemandForecastItem {
  month: string;
  react: number;
  java: number;
  aws: number;
  python: number;
  kubernetes: number;
}

export interface DeptHeatmapRow {
  dept: string;
  react: number;
  java: number;
  python: number;
  aws: number;
  kubernetes: number;
  devops: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "allocation" | "project" | "promotion" | "training" | "certification";
}

export interface Report {
  id: string;
  title: string;
  description: string;
  lastGenerated: string;
  metrics: ReportMetric[];
  tableData: Record<string, string | number>[];
  tableColumns: string[];
}

export interface ReportMetric {
  label: string;
  value: string | number;
  change?: string;
}

export interface EmployeeFilters {
  status?: EmployeeStatus[];
  department?: string[];
  designation?: string[];
  location?: string[];
  utilizationMin?: number;
  utilizationMax?: number;
  skills?: string[];
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  health?: ProjectHealth[];
  priority?: ProjectPriority[];
  department?: string[];
}

export interface SkillMatrixEmployee {
  id: string;
  name: string;
}

export interface SkillMatrixSkill {
  id: string;
  name: string;
}

export interface SkillMatrixData {
  employees: SkillMatrixEmployee[];
  skills: SkillMatrixSkill[];
  matrix: (string | null)[][];
}

