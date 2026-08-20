import api from "@/lib/axios";
import { Invoice, InvoiceRequest } from "@/types/invoice";

export const invoiceService = {
  async getAll(): Promise<Invoice[]> {
    try {
      const response = await api.get("/hospital-billing/invoices");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<Invoice> {
    const response = await api.get(`/hospital-billing/invoices/${id}`);
    return response.data;
  },

  async getByPatient(patientId: string): Promise<Invoice[]> {
    const response = await api.get(`/hospital-billing/invoices/patient/${patientId}`);
    return response.data;
  },

  async create(data: InvoiceRequest): Promise<Invoice> {
    const response = await api.post("/hospital-billing/invoices", data);
    return response.data;
  },

  async update(id: string, data: InvoiceRequest): Promise<Invoice> {
    const response = await api.put(`/hospital-billing/invoices/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/hospital-billing/invoices/${id}`);
  },
};

export type { Invoice, InvoiceRequest };