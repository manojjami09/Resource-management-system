import { useState, useEffect } from "react";
import { getDashboardStats } from "../services/dashboardService";
import { DashboardStats } from "../types";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getDashboardStats()
      .then(setStats)
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}
