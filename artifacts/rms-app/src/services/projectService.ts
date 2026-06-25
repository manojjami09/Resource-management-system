import { projects } from "../data/projects";
import { employees } from "../data/employees";
import { allocations } from "../data/allocations";
import { Project, Employee, Milestone, ProjectFilters } from "../types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  await delay(300 + Math.random() * 200);
  let result = [...projects];
  if (!filters) return result;
  if (filters.status?.length) result = result.filter((p) => filters.status!.includes(p.status));
  if (filters.health?.length) result = result.filter((p) => filters.health!.includes(p.health));
  if (filters.priority?.length) result = result.filter((p) => filters.priority!.includes(p.priority));
  if (filters.department?.length) result = result.filter((p) => filters.department!.includes(p.department));
  return result;
}

export async function getProject(id: string): Promise<Project | null> {
  await delay(200);
  return projects.find((p) => p.id === id || p.projectId === id) ?? null;
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
