import axios from 'axios';
import { StaffMember, DutyStatus, StaffOverviewStats } from '../types/staff';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api';

export const staffService = {
  async getAll(
    department?: string,
    dutyStatus?: string,
    accountStatus?: string,
    search?: string
  ): Promise<StaffMember[]> {
    const params = new URLSearchParams();
    if (department && department !== 'All') params.append('department', department);
    if (dutyStatus && dutyStatus !== 'All') params.append('dutyStatus', dutyStatus);
    if (accountStatus && accountStatus !== 'All') params.append('accountStatus', accountStatus);
    if (search) params.append('search', search);

    const response = await axios.get<StaffMember[]>(`${API_BASE_URL}/staff`, { params });
    return response.data;
  },

  async getStats(): Promise<StaffOverviewStats> {
    const response = await axios.get<StaffOverviewStats>(`${API_BASE_URL}/staff/stats`);
    return response.data;
  },

  async getById(id: string): Promise<StaffMember> {
    const response = await axios.get<StaffMember>(`${API_BASE_URL}/staff/${id}`);
    return response.data;
  },

  async create(data: Partial<StaffMember>): Promise<StaffMember> {
    const response = await axios.post<StaffMember>(`${API_BASE_URL}/staff`, data);
    return response.data;
  },

  async update(id: string, data: Partial<StaffMember>): Promise<StaffMember> {
    const response = await axios.put<StaffMember>(`${API_BASE_URL}/staff/${id}`, data);
    return response.data;
  },

  async updateDutyStatus(id: string, status: DutyStatus): Promise<StaffMember> {
    const response = await axios.patch<StaffMember>(`${API_BASE_URL}/staff/${id}/duty-status`, null, {
      params: { status }
    });
    return response.data;
  },

  async updateAccountStatus(id: string, status: 'Active' | 'Suspended'): Promise<StaffMember> {
    const response = await axios.patch<StaffMember>(`${API_BASE_URL}/staff/${id}/account-status`, null, {
      params: { status }
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/staff/${id}`);
  }
};
