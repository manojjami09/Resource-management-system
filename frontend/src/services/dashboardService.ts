import { dashboardStats } from "../data/dashboard";
import { DashboardStats, ActivityItem, RolloffItem, AIInsight } from "../types";
import { apiClient } from "../lib/apiClient";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await apiClient.get('/dashboard/stats');
    return {
      ...dashboardStats,
      ...response.data,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
    throw error;
  }
}

export async function getManagerSummary() {
  try {
    const response = await apiClient.get('/insights/manager-summary');
    return response.data?.summary || response.data || "AI insights unavailable";
  } catch (error) {
    console.error("Failed to fetch manager summary", error);
    return "AI insights unavailable";
  }
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

export async function getUtilizationTrend() {
  try {
    const response = await apiClient.get('/dashboard/utilization-trend');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch utilization trend", error);
    return [];
  }
}

export async function getCapacityForecast() {
  try {
    const response = await apiClient.get('/dashboard/capacity-forecast');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch capacity forecast", error);
    return [];
  }
}
