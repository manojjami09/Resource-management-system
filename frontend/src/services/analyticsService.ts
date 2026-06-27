import { skillGapData } from "../data/analytics";
import { SkillGapData } from "../types";
import { apiClient } from "../lib/apiClient";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getSkillGapAnalytics(): Promise<SkillGapData> {
  try {
    const response = await apiClient.get('/skills/gap-analysis');
    const apiGaps = Array.isArray(response.data) ? response.data : [];
    const criticalShortages = apiGaps.map((gap: any) => ({
      skill: gap.skill,
      current: gap.currentCount,
      required: gap.requiredCount,
      gap: gap.gap,
      severity: gap.gap > 10 ? 'critical' : gap.gap > 5 ? 'high' : 'medium'
    }));
    return {
      ...skillGapData,
      criticalShortages: criticalShortages.length > 0 ? criticalShortages : skillGapData.criticalShortages,
    };
  } catch (error) {
    console.error("Failed to fetch skill gap analytics", error);
    throw error;
  }
}

export async function getDepartmentHeatmap() {
  await delay(300);
  return skillGapData.departmentHeatmap;
}

export async function getDemandForecast() {
  await delay(350);
  return skillGapData.demandForecast;
}
