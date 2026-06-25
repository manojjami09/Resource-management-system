import { allocations, allocationRequests } from "../data/allocations";
import { employees } from "../data/employees";
import { Allocation, AllocationRequest, SuggestedEmployee } from "../types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getAllocations(): Promise<Allocation[]> {
  await delay(300);
  return [...allocations];
}

export async function getPendingRequests(): Promise<AllocationRequest[]> {
  await delay(300);
  return [...allocationRequests];
}

export async function getSuggestedEmployees(requestId: string): Promise<SuggestedEmployee[]> {
  await delay(500 + Math.random() * 300);
  const request = allocationRequests.find((r) => r.id === requestId);
  if (!request) return [];

  const benchOrAvailable = employees.filter((e) => e.status === "bench" || e.status === "available" || e.utilization < 70);

  const scored = benchOrAvailable.map((emp) => {
    const matchingSkills = emp.skills.filter((s) => request.requiredSkills.includes(s));
    const skillMatchPct = Math.round((matchingSkills.length / request.requiredSkills.length) * 100);
    const expScore = Math.min(emp.experience / request.experienceNeeded, 1) * 100;
    const availScore = emp.status === "available" ? 100 : emp.status === "bench" ? 90 : 70;
    const overallMatch = Math.round((skillMatchPct * 0.5 + expScore * 0.3 + availScore * 0.2));
    const cappedMatch = Math.min(99, Math.max(60, overallMatch));

    const reasons: string[] = [];
    if (matchingSkills.length > 0) reasons.push(`Strong ${matchingSkills.slice(0, 2).join(" & ")} experience`);
    if (emp.experience >= request.experienceNeeded) reasons.push(`${emp.experience} years of experience meets the ${request.experienceNeeded}yr requirement`);
    if (emp.status === "bench" || emp.status === "available") reasons.push("Available immediately with no project conflicts");
    else reasons.push(`Currently at ${emp.utilization}% utilization — capacity available`);
    if (emp.certifications.length > 0) reasons.push(`Holds ${emp.certifications[0]} certification`);

    const availableIn = emp.status === "bench" || emp.status === "available" ? 0 : Math.floor(Math.random() * 14) + 1;
    const skillGap = request.requiredSkills.filter((s) => !emp.skills.includes(s));

    return { employee: emp, matchPercent: cappedMatch, matchReasons: reasons, availableIn, skillMatch: matchingSkills, skillGap };
  });

  return scored.sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 5);
}

export async function confirmAllocation(requestId: string, employeeId: string): Promise<void> {
  await delay(600);
  // In real app, this would POST to backend
  console.info(`Allocation confirmed: request ${requestId} → employee ${employeeId}`);
}

export async function rejectRequest(requestId: string): Promise<void> {
  await delay(400);
  console.info(`Request rejected: ${requestId}`);
}
