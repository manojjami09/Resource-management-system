import { useState, useEffect } from "react";
import { getDashboardStats, getManagerSummary } from "../services/dashboardService";
import { DashboardStats, Employee, Project } from "../types";
import { useAuth } from "../context/AuthContext";
import { getMe } from "../services/employeeService";
import { getMyProjects } from "../services/projectService";

export function useDashboard() {
  const { role } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [myProfile, setMyProfile] = useState<Employee | null>(null);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [managerSummary, setManagerSummary] = useState<string>("AI insights unavailable");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if (role === "ROLE_EMPLOYEE") {
      Promise.all([
        getMe(),
        getMyProjects()
      ]).then(([me, projs]) => {
        setMyProfile(me);
        setMyProjects(projs);
      }).catch(() => setError("Failed to load dashboard"))
        .finally(() => setLoading(false));
    } else {
      Promise.all([
        getDashboardStats(),
        getManagerSummary()
      ])
        .then(([statsData, summaryData]) => {
          setStats(statsData);
          setManagerSummary(typeof summaryData === 'string' ? summaryData : (summaryData?.summary || "AI insights unavailable"));
        })
        .catch(() => setError("Failed to load dashboard"))
        .finally(() => setLoading(false));
    }
  }, [role]);

  return { stats, myProfile, myProjects, managerSummary, loading, error };
}
