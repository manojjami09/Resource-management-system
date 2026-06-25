export const DEPARTMENTS = [
  "Engineering",
  "Data Science",
  "Cloud & Infrastructure",
  "DevOps",
  "Quality Assurance",
  "Mobile Development",
  "Security",
  "Project Management",
];

export const LOCATIONS = [
  "Bangalore",
  "Hyderabad",
  "Mumbai",
  "Chennai",
  "Pune",
  "Delhi NCR",
  "Kolkata",
  "Ahmedabad",
];

export const DESIGNATIONS = [
  "Junior Developer",
  "Developer",
  "Senior Developer",
  "Tech Lead",
  "Solution Architect",
  "Principal Consultant",
  "Associate Manager",
  "Manager",
  "Senior Manager",
  "Director",
];

export const CLIENTS = [
  "Goldman Sachs",
  "JPMorgan Chase",
  "Apple Inc.",
  "Microsoft Corporation",
  "Amazon Web Services",
  "Google LLC",
  "Meta Platforms",
  "Walmart Global Tech",
  "Boeing",
  "Airbus",
  "Shell Global",
  "BP Digital",
  "HSBC",
  "Barclays",
  "Deutsche Bank",
  "UBS Group",
  "Citibank",
  "Morgan Stanley",
];

export const STATUS_COLORS = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
  bench: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200" },
  available: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200" },
  "on-leave": { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400", border: "border-slate-200" },
};

export const PROJECT_STATUS_COLORS = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  planning: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  completed: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
  "on-hold": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

export const HEALTH_COLORS = {
  green: "text-emerald-600",
  yellow: "text-amber-500",
  red: "text-red-500",
};

export const PRIORITY_COLORS = {
  critical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  high: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  medium: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  low: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
};

export const NOTIFICATION_TYPE_LABELS = {
  rolloff: "Roll-off",
  bench_alert: "Bench Alert",
  skill_alert: "Skill Alert",
  request: "Resource Request",
  delay: "Project Delay",
};

export const ITEMS_PER_PAGE = 25;

export const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { path: "/employees", label: "Employees", icon: "Users" },
  { path: "/projects", label: "Projects", icon: "FolderKanban" },
  { path: "/allocation", label: "Smart Allocation", icon: "Sparkles" },
  { path: "/skill-gap", label: "Skill Gap", icon: "BarChart3" },
  { path: "/reports", label: "Reports", icon: "FileText" },
  { path: "/notifications", label: "Notifications", icon: "Bell" },
  { path: "/settings", label: "Settings", icon: "Settings" },
];
