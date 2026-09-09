import { useState, useEffect, useCallback, useRef } from 'react';
import { complianceService } from '@/services/complianceService';
import { ComplianceReport, ComplianceReportRequest } from '@/types/hospital';

const TOKEN_KEY = "healthbridge_token";

const isLoginPage = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname === '/login' || window.location.pathname === '/';
};

export const useCompliance = () => {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const hasFetched = useRef(false);

  const fetchAllReports = useCallback(async () => {
    if (isLoginPage()) {
      console.log('⏳ On login page - Skipping API call');
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.log('⏳ No token found - Skipping API call');
      return;
    }

    if (!isMounted.current) return;
    setLoading(true);
    setError(null);
    
    try {
      const data = await complianceService.getAllReports();
      if (isMounted.current) {
        setReports(data);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch compliance reports';
      if (isMounted.current) {
        setError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const createReport = useCallback(async (data: ComplianceReportRequest): Promise<ComplianceReport> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      const newReport = await complianceService.createReport(data);
      if (isMounted.current) {
        setReports((prev) => [...prev, newReport]);
      }
      return newReport;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create compliance report';
      if (isMounted.current) {
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const updateReport = useCallback(async (id: string, data: ComplianceReportRequest): Promise<ComplianceReport> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      const updated = await complianceService.updateReport(id, data);
      if (isMounted.current) {
        setReports((prev) =>
          prev.map((report) => (report.id === id ? updated : report))
        );
      }
      return updated;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update compliance report';
      if (isMounted.current) {
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const deleteReport = useCallback(async (id: string): Promise<void> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      await complianceService.deleteReport(id);
      if (isMounted.current) {
        setReports((prev) => prev.filter((report) => report.id !== id));
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete compliance report';
      if (isMounted.current) {
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const getHospitalReports = useCallback(async (hospitalId: string): Promise<ComplianceReport[]> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      return await complianceService.getHospitalReports(hospitalId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hospital reports';
      if (isMounted.current) {
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // ✅ Effect only runs once
  useEffect(() => {
    if (!isLoginPage() && !hasFetched.current) {
      hasFetched.current = true;
      fetchAllReports();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchAllReports]);

  return {
    reports,
    loading,
    error,
    fetchAllReports,
    createReport,
    updateReport,
    deleteReport,
    getHospitalReports,
  };
};