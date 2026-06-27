import { useState, useEffect, useCallback } from "react";
import { getEmployees, searchEmployees } from "../services/employeeService";
import { Employee, EmployeeFilters } from "../types";

export function useEmployees(filters?: EmployeeFilters) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmployees(filters);
      setEmployees(data);
    } catch {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);
  return { employees, loading, error, refetch: fetch };
}

export function useEmployeeSearch(query: string) {
  const [results, setResults] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    searchEmployees(query).then((data) => { setResults(data); setLoading(false); });
  }, [query]);

  return { results, loading };
}
