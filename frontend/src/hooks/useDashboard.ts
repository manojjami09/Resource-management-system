import { useState, useEffect } from "react";
import { getDashboardStats, getManagerSummary } from "../services/dashboardService";
import { DashboardStats } from "../types";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [managerSummary, setManagerSummary] = useState<string>("AI insights unavailable");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getDashboardStats(),
      getManagerSummary()
    ])
      .then(([statsData, summaryData]) => {
        setStats(statsData);
        setManagerSummary(summaryData.summary || "AI insights unavailable");
      })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return { stats, managerSummary, loading, error };
}
