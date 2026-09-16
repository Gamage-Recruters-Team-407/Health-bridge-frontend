import axios from 'axios';
import { Department, DepartmentStats } from '../types/department';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api';

export const departmentService = {
  async getAll(status?: string, search?: string): Promise<Department[]> {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.append('status', status);
    if (search) params.append('search', search);

    const response = await axios.get<Department[]>(`${API_BASE_URL}/departments`, { params });
    return response.data;
  },

  async getStats(): Promise<DepartmentStats> {
    const response = await axios.get<DepartmentStats>(`${API_BASE_URL}/departments/stats`);
    return response.data;
  },

  async getById(id: string): Promise<Department> {
    const response = await axios.get<Department>(`${API_BASE_URL}/departments/${id}`);
    return response.data;
  },

  async create(data: Partial<Department>): Promise<Department> {
    const response = await axios.post<Department>(`${API_BASE_URL}/departments`, data);
    return response.data;
  },

  async update(id: string, data: Partial<Department>): Promise<Department> {
    const response = await axios.put<Department>(`${API_BASE_URL}/departments/${id}`, data);
    return response.data;
  },

  async updateStatus(id: string, status: 'Active' | 'Inactive'): Promise<Department> {
    const response = await axios.patch<Department>(`${API_BASE_URL}/departments/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/departments/${id}`);
  }
};
