import axios from 'axios';
import { EquipmentAsset, EquipmentOverviewStats } from '@/types/equipment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api';

export const equipmentService = {
  getAll: async (params?: { category?: string; department?: string; status?: string; search?: string }): Promise<EquipmentAsset[]> => {
    const res = await axios.get<EquipmentAsset[]>(`${API_BASE_URL}/equipment`, { params });
    return res.data;
  },

  getStats: async (): Promise<EquipmentOverviewStats> => {
    const res = await axios.get<EquipmentOverviewStats>(`${API_BASE_URL}/equipment/stats`);
    return res.data;
  },

  getById: async (id: string): Promise<EquipmentAsset> => {
    const res = await axios.get<EquipmentAsset>(`${API_BASE_URL}/equipment/${id}`);
    return res.data;
  },

  create: async (data: Partial<EquipmentAsset>): Promise<EquipmentAsset> => {
    const res = await axios.post<EquipmentAsset>(`${API_BASE_URL}/equipment`, data);
    return res.data;
  },

  update: async (id: string, data: Partial<EquipmentAsset>): Promise<EquipmentAsset> => {
    const res = await axios.put<EquipmentAsset>(`${API_BASE_URL}/equipment/${id}`, data);
    return res.data;
  },

  updateStatus: async (id: string, status: string): Promise<EquipmentAsset> => {
    const res = await axios.patch<EquipmentAsset>(`${API_BASE_URL}/equipment/${id}/status`, null, {
      params: { status }
    });
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/equipment/${id}`);
  },

  getLocationsByDepartment: async (department?: string): Promise<string[]> => {
    const res = await axios.get<string[]>(`${API_BASE_URL}/equipment/locations`, {
      params: { department }
    });
    return res.data;
  }
};
