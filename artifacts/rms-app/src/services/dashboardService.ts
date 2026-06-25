import { dashboardStats } from "../data/dashboard";
import { DashboardStats, ActivityItem, RolloffItem, AIInsight } from "../types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(400 + Math.random() * 200);
  return { ...dashboardStats };
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  await delay(250);
  return [...dashboardStats.recentActivity];
}

export async function getUpcomingRolloffs(): Promise<RolloffItem[]> {
  await delay(250);
  return [...dashboardStats.upcomingRolloffs];
}

export async function getAIInsights(): Promise<AIInsight[]> {
  await delay(350);
  return [...dashboardStats.aiInsights];
}
