import api from "@/lib/axios";
import type { AnalyticsDashboardResponseDto, AnalyticsPeriod, FinancialAnalyticsResponseDto, OperationalAnalyticsResponseDto, PopulationHealthAnalyticsResponseDto, ReportsAnalyticsResponseDTO } from "@/types/analytics";
import type { HealthcareAnalyticsResponseDto } from "@/types/healthcareAnalytics";

export const analyticsService = {
  async getDashboard(period: AnalyticsPeriod, signal?: AbortSignal): Promise<AnalyticsDashboardResponseDto> {
    const response = await api.get<AnalyticsDashboardResponseDto>("/analytics/dashboard", {
      params: { period },
      signal,
    });
    return response.data;
  },
  async getHealthcare(period: AnalyticsPeriod, signal?: AbortSignal): Promise<HealthcareAnalyticsResponseDto> {
    const response = await api.get<HealthcareAnalyticsResponseDto>("/analytics/healthcare", { params: { period }, signal });
    return response.data;
  },
  async getFinancial(period: AnalyticsPeriod, signal?: AbortSignal): Promise<FinancialAnalyticsResponseDto> {
    const response = await api.get<FinancialAnalyticsResponseDto>("/analytics/financial", { params: { period }, signal });
    return response.data;
  },
  async getOperational(period: AnalyticsPeriod, signal?: AbortSignal): Promise<OperationalAnalyticsResponseDto> {
    const response = await api.get<OperationalAnalyticsResponseDto>("/analytics/operational", { params: { period }, signal });
    return response.data;
  },
  async getPopulationHealth(period: AnalyticsPeriod, signal?: AbortSignal): Promise<PopulationHealthAnalyticsResponseDto> {
    const response = await api.get<PopulationHealthAnalyticsResponseDto>("/analytics/population-health", { params: { period }, signal });
    return response.data;
  },
  async getReports(period: AnalyticsPeriod, signal?: AbortSignal): Promise<ReportsAnalyticsResponseDTO> {
    const response = await api.get<ReportsAnalyticsResponseDTO>("/analytics/reports", { params: { period }, signal });
    return response.data;
  },
};
