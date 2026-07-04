import { useState, useEffect, useCallback } from "react";
import { getProjects, getMyProjects } from "../services/projectService";
import { Project, ProjectFilters } from "../types";
import { useAuth } from "../context/AuthContext";

export function useProjects(filters?: ProjectFilters) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { role } = useAuth();

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = role === "ROLE_EMPLOYEE" ? await getMyProjects() : await getProjects(filters);
      setProjects(data);
    } catch {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters), role]);

  useEffect(() => { fetch(); }, [fetch]);
  return { projects, loading, error, refetch: fetch };
}
