import api from "@/lib/axios";
import type { AnalyticsDashboardResponseDto, AnalyticsPeriod } from "@/types/analytics";

export const analyticsService = {
  async getDashboard(period: AnalyticsPeriod, signal?: AbortSignal): Promise<AnalyticsDashboardResponseDto> {
    const response = await api.get<AnalyticsDashboardResponseDto>("/analytics/dashboard", {
      params: { period },
      signal,
    });
    return response.data;
  },
};
