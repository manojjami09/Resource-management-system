import { useState, useEffect, useCallback } from "react";
import { getProjects } from "../services/projectService";
import { Project, ProjectFilters } from "../types";

export function useProjects(filters?: ProjectFilters) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects(filters);
      setProjects(data);
    } catch {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);
  return { projects, loading, error, refetch: fetch };
}
