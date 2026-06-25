import { Employee } from "../types";

const depts = ["Engineering", "Data Science", "Cloud & Infrastructure", "DevOps", "Quality Assurance", "Mobile Development", "Security", "Project Management"];
const locations = ["Bangalore", "Hyderabad", "Mumbai", "Chennai", "Pune", "Delhi NCR", "Kolkata", "Ahmedabad"];
const statuses: Employee["status"][] = ["active", "active", "active", "active", "active", "active", "active", "bench", "bench", "available", "on-leave"];
const designations = ["Junior Developer", "Developer", "Senior Developer", "Tech Lead", "Solution Architect", "Principal Consultant", "Associate Manager", "Manager", "Senior Manager", "Director"];

const skillSets: Record<string, string[]> = {
  "Engineering": ["React", "TypeScript", "Node.js", "Java", "Spring Boot", "Microservices", "PostgreSQL", "Redis", "GraphQL", "Next.js"],
  "Data Science": ["Python", "Apache Spark", "Kafka", "Airflow", "dbt", "Snowflake", "BigQuery", "Pandas", "SQL", "Databricks"],
  "Cloud & Infrastructure": ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Terraform", "CloudFormation", "Ansible", "Serverless", "Helm"],
  "DevOps": ["CI/CD", "Jenkins", "GitHub Actions", "GitLab CI", "ArgoCD", "Prometheus", "Grafana", "Docker", "Kubernetes", "Terraform"],
  "Quality Assurance": ["Selenium", "JMeter", "Cypress", "Jest", "Playwright", "Appium", "LoadRunner", "Postman", "TestNG", "Robot Framework"],
  "Mobile Development": ["React Native", "Flutter", "iOS", "Android", "Swift", "Kotlin", "TypeScript", "Firebase", "Redux"],
  "Security": ["SAST", "Penetration Testing", "OWASP", "IAM", "Zero Trust", "SOC2", "Vault", "CISSP"],
  "Project Management": ["Agile", "Scrum", "Kanban", "PMP", "JIRA", "Confluence", "SAFe", "Prince2", "MS Project"],
};

const certSets: Record<string, string[]> = {
  "Engineering": ["Oracle Java SE", "AWS Developer Associate"],
  "Data Science": ["Databricks Certified", "Snowflake SnowPro", "Google Cloud Professional"],
  "Cloud & Infrastructure": ["AWS Solutions Architect", "Azure Solutions Architect", "Kubernetes Administrator (CKA)", "Terraform Associate"],
  "DevOps": ["Kubernetes Administrator (CKA)", "AWS Developer Associate", "Terraform Associate"],
  "Quality Assurance": ["Certified Scrum Master"],
  "Mobile Development": ["AWS Developer Associate"],
  "Security": ["CISSP"],
  "Project Management": ["PMP", "Certified Scrum Master"],
};

const clients = ["Goldman Sachs", "JPMorgan Chase", "Apple Inc.", "Microsoft Corp.", "Amazon", "Google LLC", "Meta Platforms", "Walmart", "Boeing", "HSBC", "Barclays", "Morgan Stanley", "Citibank", "Deutsche Bank"];

const firstNames = ["Arjun", "Priya", "Ravi", "Sneha", "Karthik", "Divya", "Arun", "Meera", "Vijay", "Anitha", "Suresh", "Lakshmi", "Rajesh", "Nisha", "Deepak", "Kavitha", "Sanjay", "Pooja", "Manish", "Swati", "Amit", "Rekha", "Rohit", "Sunita", "Nikhil", "Asha", "Gaurav", "Poonam", "Vivek", "Smita", "Ajay", "Geeta", "Rahul", "Usha", "Vikram", "Anupama", "Sachin", "Radha", "Varun", "Chitra", "Aditya", "Lalitha", "Pranav", "Madhuri", "Siddharth", "Sushma", "Harish", "Bhavana", "Mohan", "Saroja"];
const lastNames = ["Kumar", "Sharma", "Reddy", "Nair", "Patel", "Singh", "Gupta", "Iyer", "Rao", "Pillai", "Joshi", "Mehta", "Verma", "Agarwal", "Das", "Bose", "Ghosh", "Mishra", "Pandey", "Tiwari", "Saxena", "Srivastava", "Chauhan", "Yadav", "Banerjee", "Chatterjee", "Mukherjee", "Chakraborty", "Trivedi", "Shah"];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function pickMultiple<T>(arr: T[], count: number, seed: number): T[] {
  const result: T[] = [];
  const shuffled = [...arr].sort((a, b) => ((seed * 7 + arr.indexOf(a) * 13) % 17) - ((seed * 11 + arr.indexOf(b) * 7) % 17));
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    result.push(shuffled[i]);
  }
  return result;
}

const managers = ["Rajesh Kumar", "Priya Sharma", "Vikram Nair", "Sunita Patel", "Arun Singh", "Kavitha Iyer", "Manish Gupta", "Deepak Reddy"];

const projectNames = ["Project Atlas", "Operation Nexus", "Horizon v2", "Project Phoenix", "CloudShift", "DataForge", "SecureBase", "MobileFirst", "Project Titan", "Project Aurora", "Initiative Zero", "Quantum Leap", "Project Helios", "Operation Catalyst"];

export const employees: Employee[] = Array.from({ length: 120 }, (_, i) => {
  const fn = pick(firstNames, i * 7 + 3);
  const ln = pick(lastNames, i * 11 + 5);
  const name = `${fn} ${ln}`;
  const dept = pick(depts, i * 3 + 1);
  const status = pick(statuses, i * 2 + 1);
  const desig = pick(designations, i * 5 + 2);
  const exp = 1 + (i * 7) % 20;
  const loc = pick(locations, i * 4 + 2);
  const skills = pickMultiple(skillSets[dept] || skillSets["Engineering"], 3 + (i % 5), i * 13);
  const certs = Math.random() > 0.5 ? pickMultiple(certSets[dept] || [], 1 + (i % 2), i * 17) : [];
  const utilization = status === "bench" ? 0 : status === "on-leave" ? 0 : 40 + (i * 37) % 61;
  const currentProject = (status === "active") ? pick(projectNames, i * 3 + 7) : null;
  const joinYear = 2020 - (i % 10);
  const joinMonth = String(1 + (i % 12)).padStart(2, "0");
  const joinDay = String(1 + (i % 28)).padStart(2, "0");

  return {
    id: `emp-${String(i + 1).padStart(3, "0")}`,
    employeeId: `EMP-${String(i + 1).padStart(3, "0")}`,
    employeeName: name,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6366f1,818cf8,a5b4fc&fontFamily=Inter`,
    designation: desig,
    manager: pick(managers, i * 6 + 3),
    department: dept,
    experience: exp,
    location: loc,
    skills,
    certifications: certs,
    utilization,
    status,
    joiningDate: `${joinYear}-${joinMonth}-${joinDay}`,
    availabilityDate: status === "bench" || status === "available" ? "2025-07-01" : status === "on-leave" ? "2025-08-15" : `2025-${String(8 + (i % 4)).padStart(2, "0")}-01`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@techcorp.com`,
    phone: `+91 ${String(9000000000 + i * 13371).slice(0, 10)}`,
    salary: (800000 + (i * 47000)) % 3500000 + 600000,
    currentProject,
    billableRate: 45 + (i * 7) % 155,
  };
});
