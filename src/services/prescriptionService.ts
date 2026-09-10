import api from "@/lib/axios";
import { Prescription, CreatePrescriptionDTO } from "@/types/prescription";

export const prescriptionService = {
  getAllPrescriptions: async (): Promise<Prescription[]> => {
    const response = await api.get("/prescriptions");
    return response.data;
  },

  getPrescriptionById: async (id: string): Promise<Prescription> => {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  },

  createPrescription: async (data: CreatePrescriptionDTO): Promise<Prescription> => {
    const response = await api.post("/prescriptions", data);
    return response.data;
  },

  updatePrescription: async (id: string, data: Partial<CreatePrescriptionDTO>): Promise<Prescription> => {
    const response = await api.put(`/prescriptions/${id}`, data);
    return response.data;
  },

  downloadPrescription: async (id: string): Promise<Blob> => {
    const response = await api.get(`/prescriptions/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },

  // =========================================================================
  // DEVELOPER 03 (PATIENT MANAGEMENT) - DO NOT MODIFY OR DELETE
  // This endpoint is required for the Patient Portal (My Prescriptions page).
  // =========================================================================
  getPatientPrescriptions: async (patientId: string): Promise<Prescription[]> => {
    const response = await api.get(`/prescriptions/patient/${patientId}`);
    return response.data;
  },
};