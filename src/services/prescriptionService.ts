import api from "@/lib/axios";
import { Prescription, CreatePrescriptionDTO } from "@/types/prescription";

export const prescriptionService = {
  getAllPrescriptions: async (): Promise<Prescription[]> => {
    return await api.get<Prescription[]>("/prescriptions");
  },

  getPrescriptionById: async (id: string): Promise<Prescription> => {
    return await api.get<Prescription>(`/prescriptions/${id}`);
  },

  createPrescription: async (data: CreatePrescriptionDTO): Promise<Prescription> => {
    return await api.post<Prescription>("/prescriptions", data);
  },

  updatePrescription: async (id: string, data: Partial<CreatePrescriptionDTO>): Promise<Prescription> => {
    return await api.put<Prescription>(`/prescriptions/${id}`, data);
  },

  downloadPrescription: async (id: string): Promise<Blob> => {
    return await api.get<Blob>(`/prescriptions/${id}/download`, {
      responseType: "blob",
    });
  },

  // =========================================================================
  // DEVELOPER 03 (PATIENT MANAGEMENT) - DO NOT MODIFY OR DELETE
  // This endpoint is required for the Patient Portal (My Prescriptions page).
  // =========================================================================
  getPatientPrescriptions: async (patientId: string): Promise<Prescription[]> => {
    return await api.get<Prescription[]>(`/prescriptions/patient/${patientId}`);
  },
};