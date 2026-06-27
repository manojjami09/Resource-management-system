import { employees } from "../data/employees";
import { allocations } from "../data/allocations";
import { Employee, Allocation, EmployeeFilters, TimelineEvent } from "../types";
import { apiClient } from "../lib/apiClient";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getEmployees(filters?: EmployeeFilters): Promise<Employee[]> {
  try {
    const params = filters ? { ...filters } : {};
    const response = await apiClient.get('/employees', { params });
    return response.data.map((apiEmp: any) => {
      const mock = employees.find(e => String(e.id) === String(apiEmp.id)) || employees[0];
      return {
        ...mock,
        ...apiEmp,
        id: String(apiEmp.id),
        employeeName: apiEmp.name || mock.employeeName,
        utilization: apiEmp.allocationPercent ?? mock.utilization ?? 0,
        skills: apiEmp.skills || mock.skills || [],
      };
    });
  } catch (error) {
    console.error("Failed to fetch employees", error);
    throw error;
  }
}

export async function getEmployee(id: string): Promise<Employee | null> {
  try {
    const response = await apiClient.get(`/employees/${id}`);
    const apiEmp = response.data;
    const mock = employees.find(e => String(e.id) === String(apiEmp.id)) || employees[0];
    return {
      ...mock,
      ...apiEmp,
      id: String(apiEmp.id),
      employeeName: apiEmp.name || mock.employeeName,
      utilization: apiEmp.allocationPercent ?? mock.utilization ?? 0,
      skills: apiEmp.skills || mock.skills || [],
    };
  } catch (error) {
    console.error(`Failed to fetch employee ${id}`, error);
    return null;
  }
}

export async function getEmployeeAllocations(employeeId: string): Promise<Allocation[]> {
  await delay(200);
  return allocations.filter((a) => a.employeeId === employeeId);
}

export async function getEmployeeTimeline(employeeId: string): Promise<TimelineEvent[]> {
  await delay(250);
  const emp = employees.find((e) => e.id === employeeId);
  if (!emp) return [];
  return ([
    { id: "t1", date: emp.joiningDate, title: "Joined TechCorp", description: `Started as ${emp.designation} in ${emp.department}`, type: "promotion" as const },
    { id: "t2", date: "2023-04-01", title: "Allocated to Project", description: `Assigned to ${emp.currentProject || "internal project"}`, type: "allocation" as const },
    { id: "t3", date: "2024-01-15", title: "Certification Earned", description: emp.certifications[0] || "Internal certification", type: "certification" as const },
    { id: "t4", date: "2024-07-01", title: "Promotion", description: `Promoted to ${emp.designation}`, type: "promotion" as const },
    { id: "t5", date: "2025-01-10", title: "New Allocation", description: `Allocated to ${emp.currentProject || "new project"}`, type: "allocation" as const },
  ] as TimelineEvent[]).filter((t) => new Date(t.date) <= new Date());
}

export async function getBenchEmployees(): Promise<Employee[]> {
  await delay(250);
  return employees.filter((e) => e.status === "bench" || e.status === "available");
}

export async function searchEmployees(query: string): Promise<Employee[]> {
  await delay(150);
  const q = query.toLowerCase();
  return employees.filter(
    (e) =>
      e.employeeName.toLowerCase().includes(q) ||
      e.employeeId.toLowerCase().includes(q) ||
      e.skills.some((s) => s.toLowerCase().includes(q)) ||
      e.department.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q)
  ).slice(0, 10);
}
