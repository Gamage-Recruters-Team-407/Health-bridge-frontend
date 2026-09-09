import { useState, useEffect, useCallback } from 'react';
import { complianceService } from '@/services/complianceService';
import { ComplianceReport, ComplianceReportRequest } from '@/types/hospital';

export const useCompliance = () => {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await complianceService.getAllReports();
      setReports(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch compliance reports');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReport = useCallback(async (data: ComplianceReportRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newReport = await complianceService.createReport(data);
      setReports((prev) => [...prev, newReport]);
      return newReport;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create compliance report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReport = useCallback(async (id: string, data: ComplianceReportRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await complianceService.updateReport(id, data);
      setReports((prev) =>
        prev.map((report) => (report.id === id ? updated : report))
      );
      return updated;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update compliance report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReport = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await complianceService.deleteReport(id);
      setReports((prev) => prev.filter((report) => report.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete compliance report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHospitalReports = useCallback(async (hospitalId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await complianceService.getHospitalReports(hospitalId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hospital reports');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchAllReports();
    }, 0);

    return () => clearTimeout(timeoutId);
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