import { Report, ReportFormat } from "../types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const utilizationReport: Report = {
  id: "rep-001",
  title: "Monthly Utilization Report",
  description: "Comprehensive utilization analysis across all departments and resource pools for June 2025.",
  lastGenerated: "2025-06-25T06:00:00Z",
  metrics: [
    { label: "Avg Utilization", value: "78%", change: "+3% vs May" },
    { label: "Billable Resources", value: 96, change: "+4 vs May" },
    { label: "Bench Count", value: 18, change: "-2 vs May" },
    { label: "Revenue Impact", value: "₹4.28Cr", change: "+8.3%" },
  ],
  tableColumns: ["Department", "Headcount", "Avg Utilization", "Billable", "Bench"],
  tableData: [
    { Department: "Engineering", Headcount: 42, "Avg Utilization": "85%", Billable: 38, Bench: 4 },
    { Department: "Data Science", Headcount: 20, "Avg Utilization": "82%", Billable: 18, Bench: 2 },
    { Department: "Cloud & Infra", Headcount: 18, "Avg Utilization": "78%", Billable: 15, Bench: 3 },
    { Department: "DevOps", Headcount: 14, "Avg Utilization": "74%", Billable: 11, Bench: 3 },
    { Department: "Quality Assurance", Headcount: 12, "Avg Utilization": "70%", Billable: 9, Bench: 3 },
    { Department: "Mobile Dev", Headcount: 8, "Avg Utilization": "88%", Billable: 8, Bench: 0 },
    { Department: "Security", Headcount: 4, "Avg Utilization": "65%", Billable: 3, Bench: 1 },
    { Department: "Project Mgmt", Headcount: 2, "Avg Utilization": "72%", Billable: 2, Bench: 0 },
  ],
};

const projectSummaryReport: Report = {
  id: "rep-002",
  title: "Project Summary Report",
  description: "Status and health overview of all active and planning projects as of June 2025.",
  lastGenerated: "2025-06-25T06:00:00Z",
  metrics: [
    { label: "Active Projects", value: 28 },
    { label: "On Track", value: "22 (79%)" },
    { label: "At Risk", value: "4 (14%)" },
    { label: "On Hold", value: "2 (7%)" },
  ],
  tableColumns: ["Project", "Client", "Status", "Health", "Completion", "Budget Burn"],
  tableData: [
    { Project: "Project Atlas", Client: "Goldman Sachs", Status: "Active", Health: "Green", Completion: "42%", "Budget Burn": "37%" },
    { Project: "Operation Nexus", Client: "JPMorgan Chase", Status: "Active", Health: "Green", Completion: "65%", "Budget Burn": "54%" },
    { Project: "CloudShift", Client: "Apple Inc.", Status: "Active", Health: "Green", Completion: "78%", "Budget Burn": "89%" },
    { Project: "SecureBase v3", Client: "Microsoft Corp.", Status: "Active", Health: "Yellow", Completion: "30%", "Budget Burn": "34%" },
    { Project: "DataForge", Client: "Walmart Tech", Status: "Active", Health: "Green", Completion: "35%", "Budget Burn": "37%" },
    { Project: "OpsVision", Client: "Shell Global", Status: "On Hold", Health: "Red", Completion: "12%", "Budget Burn": "15%" },
  ],
};

const benchReport: Report = {
  id: "rep-003",
  title: "Bench Resource Report",
  description: "Detailed analysis of unallocated resources, bench aging, and reallocation recommendations.",
  lastGenerated: "2025-06-24T18:00:00Z",
  metrics: [
    { label: "Total Bench", value: 18, change: "-2 vs May" },
    { label: "Bench %", value: "15%", change: "-1.7% vs May" },
    { label: "Bench Cost (Monthly)", value: "₹45L" },
    { label: "Avg Days on Bench", value: 28 },
  ],
  tableColumns: ["Employee", "Designation", "Department", "Skills", "Days on Bench", "Last Project"],
  tableData: [
    { Employee: "Suresh Kumar", Designation: "Senior Developer", Department: "Engineering", Skills: "React, Node.js", "Days on Bench": 45, "Last Project": "Project Atlas" },
    { Employee: "Lakshmi Nair", Designation: "Data Engineer", Department: "Data Science", Skills: "Python, Spark", "Days on Bench": 32, "Last Project": "RetailPulse" },
    { Employee: "Rajesh Singh", Designation: "Cloud Engineer", Department: "Cloud & Infra", Skills: "AWS, Kubernetes", "Days on Bench": 28, "Last Project": "CloudShift" },
    { Employee: "Nisha Patel", Designation: "Developer", Department: "Engineering", Skills: "Java, Spring Boot", "Days on Bench": 21, "Last Project": "TradeSpark" },
    { Employee: "Deepak Gupta", Designation: "DevOps Engineer", Department: "DevOps", Skills: "Jenkins, Docker", "Days on Bench": 18, "Last Project": "DevPipeline" },
  ],
};

const forecastReport: Report = {
  id: "rep-004",
  title: "Resource Demand Forecast",
  description: "Projected resource demand and skill requirements for Q3-Q4 2025 based on project pipeline.",
  lastGenerated: "2025-06-23T12:00:00Z",
  metrics: [
    { label: "Expected Demand (Q3)", value: 142, change: "+18% vs Q2" },
    { label: "Supply Gap", value: 22 },
    { label: "Critical Roles", value: 6 },
    { label: "Hiring Recommended", value: 15 },
  ],
  tableColumns: ["Role", "Q3 Demand", "Current Supply", "Gap", "Urgency"],
  tableData: [
    { Role: "React Developer", "Q3 Demand": 28, "Current Supply": 18, Gap: 10, Urgency: "Critical" },
    { Role: "Kubernetes Engineer", "Q3 Demand": 22, "Current Supply": 9, Gap: 13, Urgency: "Critical" },
    { Role: "Python Data Engineer", "Q3 Demand": 20, "Current Supply": 15, Gap: 5, Urgency: "High" },
    { Role: "Cloud Architect (GCP)", "Q3 Demand": 12, "Current Supply": 6, Gap: 6, Urgency: "High" },
    { Role: "React Native Developer", "Q3 Demand": 12, "Current Supply": 4, Gap: 8, Urgency: "Critical" },
    { Role: "DevOps Engineer", "Q3 Demand": 10, "Current Supply": 8, Gap: 2, Urgency: "Medium" },
  ],
};

export async function getMonthlyUtilizationReport(): Promise<Report> {
  await delay(400);
  return utilizationReport;
}

export async function getProjectSummaryReport(): Promise<Report> {
  await delay(400);
  return projectSummaryReport;
}

export async function getBenchReport(): Promise<Report> {
  await delay(350);
  return benchReport;
}

export async function getForecastReport(): Promise<Report> {
  await delay(450);
  return forecastReport;
}

export async function exportReport(type: string, format: ReportFormat): Promise<void> {
  await delay(800 + Math.random() * 400);
  console.info(`Exporting ${type} as ${format}`);
}

export async function scheduleReport(type: string, schedule: string): Promise<void> {
  await delay(500);
  console.info(`Scheduled ${type} report: ${schedule}`);
}
