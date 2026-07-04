import { Project, Employee, Milestone, ProjectFilters, ProjectUpdate } from "../types";
import { apiClient } from "../lib/apiClient";
import { getEmployees } from "./employeeService";
import { getAllocations } from "./allocationService";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  try {
    const params = filters ? { ...filters } : {};
    const [projResponse, allocResponse] = await Promise.all([
      apiClient.get('/projects', { params }),
      apiClient.get('/allocations')
    ]);
    
    const allocations = allocResponse.data;
    
    return projResponse.data.map((apiProj: any) => {
      const projAllocations = allocations.filter((a: any) => String(a.projectId) === String(apiProj.id));
      const uniqueAllocatedEmployees = new Set(projAllocations.map((a: any) => a.employeeId)).size;
      
      return {
        id: String(apiProj.id),
        projectId: `PRJ-${String(apiProj.id).padStart(3, '0')}`,
        projectName: apiProj.name || "Unknown Project",
        client: apiProj.client || "Internal",
        status: (apiProj.status || "active").toLowerCase() as any,
        startDate: apiProj.startDate || "2024-01-01",
        endDate: apiProj.endDate || "2024-12-31",
        manager: "Rajesh Kumar",
        department: "Engineering",
        requiredSkills: apiProj.requiredSkills || [],
        teamSize: apiProj.teamSize || Math.max(10, uniqueAllocatedEmployees + 1),
        allocatedSize: uniqueAllocatedEmployees,
        billedAmount: 0,
        completionPercent: apiProj.completionPercentage || 0,
        health: "green",
        priority: "medium",
        description: "",
        milestones: [],
        vacantPositions: Math.max(0, (apiProj.teamSize || Math.max(10, uniqueAllocatedEmployees + 1)) - uniqueAllocatedEmployees),
        riskLevel: "low",
        budget: apiProj.budget
      };
    });
  } catch (error) {
    console.error("Failed to fetch projects", error);
    throw error;
  }
}

export async function getMyProjects(): Promise<Project[]> {
  try {
    const [projResponse, allocResponse] = await Promise.all([
      apiClient.get('/projects/my-projects'),
      apiClient.get('/allocations')
    ]);
    
    const allocations = allocResponse.data;
    
    return projResponse.data.map((apiProj: any) => {
      const projAllocations = allocations.filter((a: any) => String(a.projectId) === String(apiProj.id));
      const uniqueAllocatedEmployees = new Set(projAllocations.map((a: any) => a.employeeId)).size;

      return {
        id: String(apiProj.id),
        projectId: `PRJ-${String(apiProj.id).padStart(3, '0')}`,
        projectName: apiProj.name || "Unknown Project",
        client: apiProj.client || "Internal",
        status: (apiProj.status || "active").toLowerCase() as any,
        startDate: apiProj.startDate || "2024-01-01",
        endDate: apiProj.endDate || "2024-12-31",
        manager: "Rajesh Kumar",
        department: "Engineering",
        requiredSkills: apiProj.requiredSkills || [],
        teamSize: apiProj.teamSize || Math.max(10, uniqueAllocatedEmployees + 1),
        allocatedSize: uniqueAllocatedEmployees,
        billedAmount: 0,
        completionPercent: apiProj.completionPercentage || 0,
        health: "green",
        priority: "medium",
        description: "",
        milestones: [],
        vacantPositions: Math.max(0, (apiProj.teamSize || Math.max(10, uniqueAllocatedEmployees + 1)) - uniqueAllocatedEmployees),
        riskLevel: "low",
        budget: apiProj.budget
      };
    });
  } catch (error) {
    console.error("Failed to fetch my projects", error);
    throw error;
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const [projResponse, allocResponse] = await Promise.all([
      apiClient.get(`/projects/${id}`),
      apiClient.get('/allocations')
    ]);
    const apiProj = projResponse.data;
    const allocations = allocResponse.data;
    
    const projAllocations = allocations.filter((a: any) => String(a.projectId) === String(apiProj.id));
    const uniqueAllocatedEmployees = new Set(projAllocations.map((a: any) => a.employeeId)).size;
    
    return {
      id: String(apiProj.id),
      projectId: `PRJ-${String(apiProj.id).padStart(3, '0')}`,
      projectName: apiProj.name || "Unknown Project",
      client: apiProj.client || "Internal",
      status: (apiProj.status || "active").toLowerCase() as any,
      startDate: apiProj.startDate || "2024-01-01",
      endDate: apiProj.endDate || "2024-12-31",
      manager: "Rajesh Kumar",
      department: "Engineering",
      requiredSkills: apiProj.requiredSkills || [],
      teamSize: apiProj.teamSize || Math.max(10, uniqueAllocatedEmployees + 1),
      allocatedSize: uniqueAllocatedEmployees,
      billedAmount: 0,
      completionPercent: apiProj.completionPercentage || 0,
      health: "green",
      priority: "medium",
      description: "",
      milestones: [],
      vacantPositions: Math.max(0, (apiProj.teamSize || Math.max(10, uniqueAllocatedEmployees + 1)) - uniqueAllocatedEmployees),
      riskLevel: "low",
      budget: apiProj.budget
    };
  } catch (error) {
    console.error(`Failed to fetch project ${id}`, error);
    return null;
  }
}

export async function addProject(data: any): Promise<void> {
  await apiClient.post('/projects', data);
}

export async function updateProject(id: string, data: any): Promise<void> {
  await apiClient.put(`/projects/${id}`, data);
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}

export async function getProjectTeam(projectId: string): Promise<Employee[]> {
  const response = await apiClient.get(`/projects/${projectId}/team`);
  return response.data.map((apiEmp: any) => ({
    ...apiEmp,
    employeeId: `EMP-${String(apiEmp.id).padStart(3, '0')}`,
    avatar: `https://i.pravatar.cc/150?u=${apiEmp.id}`
  }));
}

export async function getProjectTimeline(projectId: string): Promise<Milestone[]> {
  const project = await getProject(projectId);
  return project?.milestones ?? [];
}

export async function searchProjects(query: string): Promise<Project[]> {
  const q = query.toLowerCase();
  const allProjects = await getProjects();
  return allProjects.filter(
    (p) =>
      p.projectName.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.projectId.toLowerCase().includes(q) ||
      p.manager.toLowerCase().includes(q)
  ).slice(0, 8);
}

export async function getProjectUpdates(projectId: string): Promise<ProjectUpdate[]> {
  const response = await apiClient.get(`/projects/${projectId}/updates`);
  return response.data;
}

export async function postProjectUpdate(projectId: string, content: string): Promise<ProjectUpdate> {
  const response = await apiClient.post(`/projects/${projectId}/updates`, { content });
  return response.data;
}

export async function updateProjectCompletion(projectId: string, percentage: number): Promise<Project> {
  const response = await apiClient.put(`/projects/${projectId}/completion`, { percentage });
  return response.data;
}
