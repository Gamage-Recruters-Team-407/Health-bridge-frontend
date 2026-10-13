import api from "@/lib/axios";

export interface SuperAdminStatsDto {
  totalUsers: number;
  totalBranches: number;
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
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  role: string;
  branch?: string;
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

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  event: string;
  module: string;
  actionDetails: string;
  refId: string;
  ipDevice: string;
  status: string;
  severity: string;
}

export interface AuditLogSummary {
  totalToday: number;
  authEvents: number;
  adminActions: number;
  recordAccess: number;
  securityEvents: number;
  failedActions: number;
}

export interface DoctorProfileResponse {
  id: string;
  doctorId: string;
  name: string;
  department: string;
  email: string;
  branchId: string;
  branchCode: string;
  accountStatus: string;
  createdAt: string;
}

export interface StaffResponseDto {
  id: string;
  mongoId?: string;
  staffId?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  role: string;
  department?: string;
  email: string;
  phone?: string;
  extension?: string;
  dutyStatus?: string;
  currentShift?: string;
  avatarUrl?: string;
  initials?: string;
  accountStatus: string;
  branchId?: string;
  branchCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionDto {
  id?: string;
  moduleName: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canExport: boolean;
  canManage: boolean;
}

export interface RoleResponseDto {
  id: string;
  roleId: string;
  name: string;
  type: string;
  status: string;
  userCount: number;
  permissionIds?: string[];
  permissions?: PermissionDto[];
  riskLevel?: string;
  riskRecommendations?: string;
  updatedAt?: string;
}

export interface RoleSummaryDto {
  totalRoles: number;
  activeUsers: number;
  customRoles: number;
  highRiskPermissions: number;
  recentChanges: number;
}

export interface BranchResponseDto {
  id: string;
  branchCode?: string;
  branchName: string;
  hospitalId?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  status: string;
  totalBeds?: number;
  emergencyReady?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BranchRequestDto {
  branchCode?: string;
  branchName: string;
  hospitalId?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  status?: string;
  totalBeds?: number;
  emergencyReady?: boolean;
}

export interface LaboratoryResponseDto {
  id: string;
  labId?: string;
  name: string;
  address?: string;
  license?: string;
  owner?: string;
  requestDate?: string;
  approvedDate?: string;
  status: string;
  email?: string;
  phone?: string;
  category?: string;
  yearsInOperation?: string;
}

export interface LaboratoryRequestDto {
  name: string;
  address?: string;
  license?: string;
  owner?: string;
  status?: string;
  email?: string;
  phone?: string;
  category?: string;
  yearsInOperation?: string;
}

export interface InsuranceProviderResponseDto {
  id: string;
  providerId: string;
  logoText: string;
  logoColor: string;
  name: string;
  licenseNo: string;
  contactName: string;
  contactRole: string;
  coverageRegions: string[];
  status: string;
}

export interface InsuranceProviderRequestDto {
  name: string;
  licenseNo: string;
  contactName: string;
  contactRole: string;
  coverageRegions?: string[];
  status?: string;
  logoText?: string;
  logoColor?: string;
}

export interface SystemSettingItemDto {
  id?: string;
  category?: string;
  settingKey: string;
  settingValue: string;
  description?: string;
}

export interface PharmacyBranch {
  id: string;
  registrationNumber: string;
  name: string;
  licenseNumber: string;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  operatingHours?: string;
  active: boolean;
  approved: boolean;
}

export const superAdminService = {
  async getAllPharmacyBranches(): Promise<PharmacyBranch[]> {
    return api.get<PharmacyBranch[]>("/v1/pharmacy/pharmacies");
  },

  async approvePharmacy(id: string): Promise<PharmacyBranch> {
    return api.patch<PharmacyBranch>(`/v1/pharmacy/pharmacies/${id}/approve`);
  },

  async setPharmacyActive(id: string, active: boolean): Promise<PharmacyBranch> {
    return api.patch<PharmacyBranch>(`/v1/pharmacy/pharmacies/${id}/active?active=${active}`);
  },

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

  async getAllStaff(): Promise<StaffResponseDto[]> {
    const res: any = await api.get("/staff");
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  },

  async createStaff(data: any): Promise<StaffResponseDto> {
    const res: any = await api.post("/staff", data);
    return res?.data || res;
  },

  async getStaffById(id: string): Promise<StaffResponseDto> {
    const res: any = await api.get(`/staff/${id}`);
    return res?.data || res;
  },

  async updateStaffDetails(id: string, data: any): Promise<StaffResponseDto> {
    const res: any = await api.put(`/staff/${id}`, data);
    return res?.data || res;
  },

  async updateStaffStatus(id: string, status: string): Promise<StaffResponseDto> {
    const res: any = await api.patch(`/staff/${id}/account-status?status=${status}`);
    return res?.data || res;
  },

  async deleteStaff(id: string): Promise<void> {
    return api.delete(`/staff/${id}`);
  },

  async updateUserStatus(id: string, status: string): Promise<UserProfileResponse> {
    return api.put<UserProfileResponse>(`/users/${id}/status`, { status });
  },

  async deleteUser(id: string): Promise<void> {
    return api.delete(`/users/${id}`);
  },

  // --- Roles API ---
  async getAllRoles(): Promise<RoleResponseDto[]> {
    const res: any = await api.get("/admin/roles");
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  },

  async getRoleById(id: string): Promise<RoleResponseDto> {
    const res: any = await api.get(`/admin/roles/${id}`);
    return res?.data || res;
  },

  async createRole(data: any): Promise<RoleResponseDto> {
    const res: any = await api.post("/admin/roles", data);
    return res?.data || res;
  },

  async updateRole(id: string, data: any): Promise<RoleResponseDto> {
    const res: any = await api.put(`/admin/roles/${id}`, data);
    return res?.data || res;
  },

  async deleteRole(id: string): Promise<void> {
    return api.delete(`/admin/roles/${id}`);
  },

  async updateRoleStatus(id: string, status: string): Promise<RoleResponseDto> {
    const res: any = await api.patch(`/admin/roles/${id}/status?status=${status}`);
    return res?.data || res;
  },

  async getRoleSummary(): Promise<RoleSummaryDto> {
    const res: any = await api.get("/admin/roles/summary");
    return res?.data || res;
  },

  // --- Permissions API ---
  async getPermissionById(id: string): Promise<PermissionDto> {
    const res: any = await api.get(`/admin/permissions/${id}`);
    return res?.data || res;
  },

  async createPermission(data: any): Promise<PermissionDto> {
    const res: any = await api.post("/admin/permissions", data);
    return res?.data || res;
  },

  async updatePermission(id: string, data: any): Promise<PermissionDto> {
    const res: any = await api.put(`/admin/permissions/${id}`, data);
    return res?.data || res;
  },

  // --- Hospital Branches API ---
  async getAllBranches(): Promise<BranchResponseDto[]> {
    const res: any = await api.get("/branches");
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  },

  async getBranchById(id: string): Promise<BranchResponseDto> {
    const res: any = await api.get(`/branches/${id}`);
    return res?.data || res;
  },

  async createBranch(data: BranchRequestDto): Promise<BranchResponseDto> {
    const res: any = await api.post("/branches", data);
    return res?.data || res;
  },

  async updateBranch(id: string, data: Partial<BranchRequestDto>): Promise<BranchResponseDto> {
    const res: any = await api.put(`/branches/${id}`, data);
    return res?.data || res;
  },

  async deleteBranch(id: string): Promise<void> {
    return api.delete(`/branches/${id}`);
  },

  async createUser(data: any): Promise<void> {
    return api.post('/auth/register', data);
  },

  async getUserById(id: string): Promise<UserProfileResponse> {
    return api.get<UserProfileResponse>(`/users/profile/${id}`);
  },

  async updateUserDetails(id: string, data: any): Promise<UserProfileResponse> {
    return api.put<UserProfileResponse>(`/users/${id}`, data);
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
  },

  async downloadAnalyticsReport(): Promise<void> {
    const blobData: Blob = await api.get("/super-admin/dashboard/analytics/report", {
      responseType: 'blob'
    }) as any;
    const url = window.URL.createObjectURL(blobData);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `System_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  },

  async getAllAuditLogs(): Promise<AuditLog[]> {
    return api.get<AuditLog[]>("/admin/audit-logs");
  },

  async getAuditLogSummary(): Promise<AuditLogSummary> {
    return api.get<AuditLogSummary>("/admin/audit-logs/summary");
  },

  async downloadAuditReport(): Promise<void> {
    const blobData: Blob = await api.get("/admin/audit-logs/report", {
      responseType: 'blob'
    }) as any;
    const url = window.URL.createObjectURL(blobData);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Audit_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  },

  // --- Doctors API ---
  async getAllDoctors(department?: string, accountStatus?: string, search?: string): Promise<DoctorProfileResponse[]> {
    const params = new URLSearchParams();
    if (department && department !== "All departments") params.append("department", department);
    if (accountStatus && accountStatus !== "All statuses") params.append("accountStatus", accountStatus);
    if (search) params.append("search", search);

    const res: any = await api.get(`/doctors?${params.toString()}`);
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  },

  async getDoctorById(id: string): Promise<DoctorProfileResponse> {
    const res: any = await api.get(`/doctors/${id}`);
    return res?.data || res;
  },

  async createDoctor(data: any): Promise<DoctorProfileResponse> {
    const res: any = await api.post("/doctors", data);
    return res?.data || res;
  },

  async updateDoctor(id: string, data: any): Promise<DoctorProfileResponse> {
    const res: any = await api.put(`/doctors/${id}`, data);
    return res?.data || res;
  },

  async updateDoctorStatus(id: string, status: string): Promise<DoctorProfileResponse> {
    const res: any = await api.patch(`/doctors/${id}/account-status?status=${status}`);
    return res?.data || res;
  },

  async deleteDoctor(id: string): Promise<void> {
    return api.delete(`/doctors/${id}`);
  },

  // --- Laboratories API ---
  async getAllLaboratories(): Promise<LaboratoryResponseDto[]> {
    const res: any = await api.get("/admin/laboratories");
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  },

  async getLaboratoryById(id: string): Promise<LaboratoryResponseDto> {
    const res: any = await api.get(`/admin/laboratories/${id}`);
    return res?.data || res;
  },

  async createLaboratory(data: LaboratoryRequestDto): Promise<LaboratoryResponseDto> {
    const res: any = await api.post("/admin/laboratories", data);
    return res?.data || res;
  },

  async updateLaboratory(id: string, data: Partial<LaboratoryRequestDto>): Promise<LaboratoryResponseDto> {
    const res: any = await api.put(`/admin/laboratories/${id}`, data);
    return res?.data || res;
  },

  async updateLaboratoryStatus(id: string, status: string): Promise<LaboratoryResponseDto> {
    const res: any = await api.put(`/admin/laboratories/${id}/status`, { status });
    return res?.data || res;
  },

  // --- Insurance Providers API ---
  async getAllInsuranceProviders(): Promise<InsuranceProviderResponseDto[]> {
    const res: any = await api.get("/admin/insurance-providers");
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  },

  async getInsuranceProviderById(id: string): Promise<InsuranceProviderResponseDto> {
    const res: any = await api.get(`/admin/insurance-providers/${id}`);
    return res?.data || res;
  },

  async createInsuranceProvider(data: InsuranceProviderRequestDto): Promise<InsuranceProviderResponseDto> {
    const res: any = await api.post("/admin/insurance-providers", data);
    return res?.data || res;
  },

  async updateInsuranceProvider(id: string, data: Partial<InsuranceProviderRequestDto>): Promise<InsuranceProviderResponseDto> {
    const res: any = await api.put(`/admin/insurance-providers/${id}`, data);
    return res?.data || res;
  },

  async updateInsuranceProviderStatus(id: string, status: string): Promise<InsuranceProviderResponseDto> {
    const res: any = await api.put(`/admin/insurance-providers/${id}/status`, { status });
    return res?.data || res;
  },

  async deleteInsuranceProvider(id: string): Promise<void> {
    return api.delete(`/admin/insurance-providers/${id}`);
  },

  async seedInsuranceProviders(): Promise<string> {
    const res: any = await api.post("/admin/insurance-providers/seed");
    return res?.data || res;
  },

  // --- System Settings API ---
  async getSystemSettings(): Promise<SystemSettingItemDto[]> {
    const res: any = await api.get("/admin/system-settings");
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  },

  async updateSystemSetting(settingKey: string, dto: Partial<SystemSettingItemDto>): Promise<SystemSettingItemDto> {
    try {
      const res: any = await api.put(`/admin/system-settings/${settingKey}`, dto);
      return res?.data || res;
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.status === 404) {
        const createRes: any = await api.post("/admin/system-settings", {
          ...dto,
          settingKey
        });
        return createRes?.data || createRes;
      }
      throw err;
    }
  },

  async resetSystemSettings(): Promise<void> {
    return api.post("/admin/system-settings/reset");
  }
};

