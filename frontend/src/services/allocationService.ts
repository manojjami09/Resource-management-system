import { Allocation, AllocationRequest, SuggestedEmployee } from "../types";
import { apiClient } from "../lib/apiClient";
import { getEmployees, getEmployee, updateEmployee } from "./employeeService";
import { getProjects, getProject } from "./projectService";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getAllocations(): Promise<Allocation[]> {
  try {
    const response = await apiClient.get('/allocations');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch allocations", error);
    throw error;
  }
}

export async function createAllocation(data: any): Promise<void> {
  await apiClient.post('/allocations', data);
}

export async function getPendingRequests(): Promise<AllocationRequest[]> {
  const projects = await getProjects();
  const pendingProjects = projects.filter((p) => p.vacantPositions > 0);
  return pendingProjects.map((p) => ({
    id: p.id,
    projectId: p.id,
    projectName: p.projectName,
    client: p.client,
    requiredSkills: p.requiredSkills,
    experienceNeeded: 1, // Defaulting to 1 year
    priority: "high",
    requestDate: p.startDate,
    startDate: p.startDate,
    role: "Developer",
    description: "Requires resource allocation"
  }));
}

export async function getSuggestedEmployees(requestId: string): Promise<SuggestedEmployee[]> {
  const request = await getProject(requestId);
  if (!request) return [];

  const allEmployees = await getEmployees();
  const candidates = allEmployees.filter((e) => {
    const status = (e.status || "").toUpperCase();
    return status === "BENCH" || status === "AVAILABLE" || status === "ALLOCATED";
  });

  const scored = candidates.map((emp) => {
    const reqSkillsLower = request.requiredSkills.map(rs => rs.toLowerCase());
    const matchingSkillsObjs = emp.skills.filter((s: any) => reqSkillsLower.includes(String(s.name || s).toLowerCase()));
    const matchingSkills = matchingSkillsObjs.map((s: any) => s.name || s);
    
    if (matchingSkills.length === 0 && request.requiredSkills.length > 0) {
      return { employee: emp, matchPercent: 0, matchReasons: ["No required skills match"], availableIn: 0, skillMatch: [], skillGap: request.requiredSkills };
    }

    const skillMatchPct = request.requiredSkills.length === 0 ? 100 : Math.round((matchingSkills.length / request.requiredSkills.length) * 100);
    const cappedMatch = Math.min(100, Math.max(0, skillMatchPct));

    const reasons: string[] = [];
    if (matchingSkills.length > 0) reasons.push(`Strong ${matchingSkills.slice(0, 2).join(" & ")} experience`);
    
    const status = (emp.status || "").toUpperCase();
    if (status === "BENCH" || status === "AVAILABLE") {
      reasons.push("Available immediately with no project conflicts");
    } else if (status === "ALLOCATED") {
      const projName = emp.currentAllocations?.[0]?.projectName || "another project";
      reasons.push(`Currently on: ${projName}`);
    }

    const availableIn = 0;
    const skillGap = request.requiredSkills.filter((s) => !emp.skills.some((es: any) => String(es.name || es).toLowerCase() === s.toLowerCase()));

    return { employee: emp, matchPercent: cappedMatch, matchReasons: reasons, availableIn, skillMatch: matchingSkills, skillGap };
  });

  const qualified = scored.filter(s => s.matchPercent > 0);
  
  return qualified.sort((a, b) => {
    const aStatus = (a.employee.status || "").toUpperCase();
    const bStatus = (b.employee.status || "").toUpperCase();
    const aAvail = (aStatus === "BENCH" || aStatus === "AVAILABLE") ? 1 : 0;
    const bAvail = (bStatus === "BENCH" || bStatus === "AVAILABLE") ? 1 : 0;
    
    if (aAvail !== bAvail) return bAvail - aAvail;
    return b.matchPercent - a.matchPercent;
  }).slice(0, 15);
}

export async function confirmAllocation(requestId: string, employeeId: string): Promise<void> {
  const request = await getProject(requestId);
  if (!request) return;
  
  const employee = await getEmployee(employeeId);
  if (!employee) return;
  
  const percentToAllocate = 100;

  await createAllocation({
    employeeId: employeeId,
    projectId: requestId, 
    allocationPercent: percentToAllocate,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]
  });
  
  await updateEmployee(employeeId, { ...employee, status: "ALLOCATED" });
}

export async function rejectRequest(requestId: string): Promise<void> {
  await delay(400);
  console.info(`Request rejected: ${requestId}`);
}
