"use client";

import { useCallback, useEffect, useState } from "react";

export interface PatientSummary {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
}

export function usePatients() {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to load patients");
      }

      const data = (await response.json()) as PatientSummary[];
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    patients,
    loading,
    error,
    reload,
  };
}

export default usePatients;
