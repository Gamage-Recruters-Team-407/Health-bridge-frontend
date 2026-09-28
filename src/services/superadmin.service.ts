import api from "@/lib/axios";

export interface SuperAdminStatsDto {
  totalUsers: number;
  totalHospitals: number;
  activeDoctors: number;
  activeSessions: number;
  systemHealthPercentage: number;
  securityAlerts: number;
  totalRevenue: number;
  pendingVerifications: number;
  monthlyRecurringRevenue: number;
  storageUsedPercentage: number;
  topPendingApprovals: {
    id: string;
    name: string;
    role: string;
    timeAgo: string;
  }[];
}

export interface UserProfileResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  accountStatus: string;
  createdAt: string;
  updatedAt?: string;
  picture?: string;
}

export interface SuperAdminGrowthDto {
  name: string;
  users: number;
  appointments: number;
  revenue: number;
}

export interface SystemAnalyticsDto {
  dau: number;
  mau: number;
  stickiness: number;
  dauGrowth: number;
  mauGrowth: number;
  featureAdoption: {
    name: string;
    percentage: number;
    label: string;
  }[];
  modulePerformance: {
    name: string;
    active: string;
    score: number;
    growth: string;
    status: string;
  }[];
  revenueBreakdown: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}

export const superAdminService = {
  async getDashboardStats(): Promise<SuperAdminStatsDto> {
    return api.get<SuperAdminStatsDto>("/super-admin/dashboard/stats");
  },
  
  async getGrowthData(): Promise<SuperAdminGrowthDto[]> {
    return api.get<SuperAdminGrowthDto[]>("/super-admin/dashboard/growth");
  },

  async getSystemAnalytics(): Promise<SystemAnalyticsDto> {
    return api.get<SystemAnalyticsDto>("/super-admin/dashboard/analytics");
  },

  async getAllUsers(): Promise<UserProfileResponse[]> {
    return api.get<UserProfileResponse[]>("/users");
  },

  async getAllStaff(): Promise<UserProfileResponse[]> {
    // TODO: Create a dedicated /staff endpoint on the backend in the future
    return api.get<UserProfileResponse[]>("/users");
  },

  async downloadDashboardReport(): Promise<void> {
    const blobData: Blob = await api.get("/super-admin/dashboard/report", {
      responseType: 'blob'
    }) as any;
    const url = window.URL.createObjectURL(blobData);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Dashboard_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }
};
