import api from "@/lib/axios";
import type { AnalyticsDashboardResponseDto, AnalyticsPeriod } from "@/types/analytics";
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
};
