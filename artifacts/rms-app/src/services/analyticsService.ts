import { skillGapData } from "../data/analytics";
import { SkillGapData } from "../types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getSkillGapAnalytics(): Promise<SkillGapData> {
  await delay(400 + Math.random() * 200);
  return { ...skillGapData };
}

export async function getDepartmentHeatmap() {
  await delay(300);
  return skillGapData.departmentHeatmap;
}

export async function getDemandForecast() {
  await delay(350);
  return skillGapData.demandForecast;
}
