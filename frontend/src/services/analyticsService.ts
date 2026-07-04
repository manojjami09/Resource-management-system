import { SkillGapData } from "../types";
import { apiClient } from "../lib/apiClient";

export async function getSkillGapAnalytics(): Promise<SkillGapData> {
  try {
    const response = await apiClient.get('/skills/gap-analysis');
    const data = response.data;
    
    return {
      requiredVsAvailable: data.requiredVsAvailable || [],
      topMissingSkills: data.topMissingSkills || [],
      skillDistribution: data.skillDistribution || [],
      demandForecast: data.demandForecast || [],
      departmentHeatmap: data.departmentHeatmap || []
    };
  } catch (error) {
    console.error("Failed to fetch skill gap analytics", error);
    throw error;
  }
}
