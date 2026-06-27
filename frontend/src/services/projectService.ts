import { projects } from "../data/projects";
import { employees } from "../data/employees";
import { allocations } from "../data/allocations";
import { Project, Employee, Milestone, ProjectFilters } from "../types";
import { apiClient } from "../lib/apiClient";

export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  try {
    const params = filters ? { ...filters } : {};
    const response = await apiClient.get('/projects', { params });
    return response.data.map((apiProj: any) => {
      const mock = projects.find(p => String(p.id) === String(apiProj.id)) || projects[0];
      return {
        ...mock,
        ...apiProj,
        id: String(apiProj.id),
        projectName: apiProj.name || mock.projectName,
        requiredSkills: apiProj.requiredSkills || mock.requiredSkills || [],
      };
    });
  } catch (error) {
    console.error("Failed to fetch projects", error);
    throw error;
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const response = await apiClient.get(`/projects/${id}`);
    const apiProj = response.data;
    const mock = projects.find(p => String(p.id) === String(apiProj.id)) || projects[0];
    return {
      ...mock,
      ...apiProj,
      id: String(apiProj.id),
      projectName: apiProj.name || mock.projectName,
      requiredSkills: apiProj.requiredSkills || mock.requiredSkills || [],
    };
  } catch (error) {
    console.error(`Failed to fetch project ${id}`, error);
    return null;
  }
}

export async function getProjectTeam(projectId: string): Promise<Employee[]> {
  await delay(250);
  const projectAllocs = allocations.filter((a) => a.projectId === projectId && a.status === "active");
  const ids = new Set(projectAllocs.map((a) => a.employeeId));
  return employees.filter((e) => ids.has(e.id));
}

export async function getProjectTimeline(projectId: string): Promise<Milestone[]> {
  await delay(200);
  const project = projects.find((p) => p.id === projectId);
  return project?.milestones ?? [];
}

export async function searchProjects(query: string): Promise<Project[]> {
  await delay(150);
  const q = query.toLowerCase();
  return projects.filter(
    (p) =>
      p.projectName.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.projectId.toLowerCase().includes(q) ||
      p.manager.toLowerCase().includes(q)
  ).slice(0, 8);
}
