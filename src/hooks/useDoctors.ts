"use client";

import { useCallback, useEffect, useState } from "react";

export interface DoctorSummary {
  id: string;
  fullName: string;
  email: string;
  specialization?: string;
  phoneNumber?: string;
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/doctors");
      if (!response.ok) {
        throw new Error("Failed to load doctors");
      }

      const data = (await response.json()) as DoctorSummary[];
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    doctors,
    loading,
    error,
    reload,
  };
}

export default useDoctors;
