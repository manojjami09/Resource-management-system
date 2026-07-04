import { DashboardStats, ActivityItem, RolloffItem, AIInsight } from "../types";
import { apiClient } from "../lib/apiClient";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await apiClient.get('/dashboard/stats');
    const apiData = response.data || {};
    const trend = await getUtilizationTrend().catch(() => []);
    const capacity = await getCapacityForecast().catch(() => []);
    return {
      totalEmployees: apiData.totalEmployees || 0,
      benchCount: apiData.benchCount || 0,
      benchPercent: apiData.benchPercent || 0,
      activeProjects: apiData.activeProjects || 0,
      avgUtilization: apiData.avgUtilization || 0,
      openRequests: 0,
      revenueThisMonth: 0,
      revenueGrowth: 0,
      utilizationHistory: trend,
      capacityVsDemand: capacity,
      benchTrend: [],
      departmentUtilization: [],
      projectStatusBreakdown: [],
      recentActivity: await getRecentActivity(),
      upcomingRolloffs: await getUpcomingRolloffs(),
      aiInsights: await getAIInsights()
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
  try {
    const response = await apiClient.get('/dashboard/recent-activity');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recent activity", error);
    return [];
  }
}

export async function getUpcomingRolloffs(): Promise<RolloffItem[]> {
  try {
    const response = await apiClient.get('/dashboard/upcoming-rolloffs');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch upcoming rolloffs", error);
    return [];
  }
}

export async function getAIInsights(): Promise<AIInsight[]> {
  try {
    const response = await apiClient.get('/dashboard/ai-insights'); // We can return empty for now, but hit a real endpoint
    return response.data;
  } catch (error) {
    return [];
  }
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
