import api from "@/lib/axios";
import { Prescription, CreatePrescriptionDTO } from "@/types/prescription";

export const prescriptionService = {
  getAllPrescriptions: async (): Promise<Prescription[]> => {
    // ✅ FIXED: api.get දැනටමත් Prescription[] return කරන නිසා .data ඕනේ නෑ
    return await api.get<Prescription[]>("/prescriptions"); 
  },

  getPrescriptionsByDoctorId: async (doctorId: string): Promise<Prescription[]> => {
    return await api.get<Prescription[]>(`/prescriptions/doctor/${doctorId}`);
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

  getPatientPrescriptions: async (patientId: string): Promise<Prescription[]> => {
    return await api.get<Prescription[]>(`/prescriptions/patient/${patientId}`);
  },
};