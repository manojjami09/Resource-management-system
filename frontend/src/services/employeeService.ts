import { Employee, Allocation, EmployeeFilters, TimelineEvent, AllocationStatus, SkillMatrixData } from "../types";
import { apiClient } from "../lib/apiClient";

export async function getEmployees(filters?: EmployeeFilters): Promise<Employee[]> {
  try {
    const params = filters ? { ...filters } : {};
    const response = await apiClient.get('/employees', { params });
    return response.data.map((apiEmp: any) => ({
      ...apiEmp,
      employeeId: `EMP-${String(apiEmp.id).padStart(3, '0')}`,
      avatar: `https://i.pravatar.cc/150?u=${apiEmp.id}`
    }));
  } catch (error) {
    console.error("Failed to fetch employees", error);
    throw error;
  }
}

export async function getEmployee(id: string): Promise<Employee | null> {
  try {
    const response = await apiClient.get(`/employees/${id}`);
    const apiEmp = response.data;
    return {
      ...apiEmp,
      employeeId: `EMP-${String(apiEmp.id).padStart(3, '0')}`,
      avatar: `https://i.pravatar.cc/150?u=${apiEmp.id}`
    };
  } catch (error) {
    console.error(`Failed to fetch employee ${id}`, error);
    return null;
  }
}

export async function getMe(): Promise<Employee | null> {
  try {
    const response = await apiClient.get(`/employees/me`);
    const apiEmp = response.data;
    return {
      ...apiEmp,
      employeeId: `EMP-${String(apiEmp.id).padStart(3, '0')}`,
      avatar: `https://i.pravatar.cc/150?u=${apiEmp.id}`
    };
  } catch (error) {
    console.error(`Failed to fetch my profile`, error);
    return null;
  }
}

export async function addEmployee(data: any): Promise<void> {
  await apiClient.post('/employees', data);
}

export async function updateEmployee(id: string, data: any): Promise<void> {
  await apiClient.put(`/employees/${id}`, data);
}

export async function deleteEmployee(id: string): Promise<void> {
  await apiClient.delete(`/employees/${id}`);
}

export async function getEmployeeAllocations(employeeId: string): Promise<Allocation[]> {
  const response = await apiClient.get(`/employees/${employeeId}/allocations`);
  return response.data.map((a: any) => ({
    id: String(a.projectId) + "-" + a.startDate,
    employeeId: employeeId,
    employeeName: "", // usually not needed since we're viewing the employee's history
    projectId: String(a.projectId),
    projectName: a.projectName,
    startDate: a.startDate,
    endDate: a.endDate,
    allocationPercent: a.allocationPercent,
    role: "Developer",
    status: (new Date(a.endDate) < new Date() ? "completed" : "active") as AllocationStatus,
    billable: true
  }));
}

export async function getEmployeeTimeline(employeeId: string): Promise<TimelineEvent[]> {
  const emp = await getEmployee(employeeId);
  if (!emp) return [];
  const allocations = await getEmployeeAllocations(employeeId);
  
  const events: TimelineEvent[] = [];
  events.push({ 
    id: "join", 
    date: emp.joiningDate, 
    title: "Joined TechCorp", 
    description: `Started as ${emp.designation} in ${emp.department}`, 
    type: "promotion" 
  });
  
  for (const alloc of allocations) {
    events.push({
      id: `alloc-${alloc.projectId}`,
      date: alloc.startDate,
      title: `Assigned to ${alloc.projectName}`,
      description: `${alloc.allocationPercent}% allocation until ${alloc.endDate}`,
      type: "allocation"
    });
  }
  
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function getBenchEmployees(): Promise<Employee[]> {
  const response = await apiClient.get('/employees/available');
  return response.data.map((apiEmp: any) => ({
    ...apiEmp,
    employeeId: `EMP-${String(apiEmp.id).padStart(3, '0')}`,
    avatar: `https://i.pravatar.cc/150?u=${apiEmp.id}`
  }));
}

export async function getSkillMatrix(): Promise<SkillMatrixData> {
  const response = await apiClient.get('/employees/skill-matrix');
  return response.data;
}

export async function searchEmployees(query: string): Promise<Employee[]> {
  const q = query.toLowerCase();
  const allEmployees = await getEmployees();
  return allEmployees.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.employeeId.toLowerCase().includes(q) ||
      e.skills.some((s) => s.name.toLowerCase().includes(q)) ||
      e.department.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q)
  ).slice(0, 10);
}

