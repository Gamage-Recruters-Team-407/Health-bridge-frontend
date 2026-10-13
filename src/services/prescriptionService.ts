import api from "@/lib/axios";
import { Prescription, CreatePrescriptionDTO } from "@/types/prescription";

export interface PatientOption {
  value: string;
  label: string;
  phone: string;
}

export interface MedicineOption {
  value: string;
  label: string;
  interactions: string[];
}

export const patientService = {
  getAllPatients: async (): Promise<PatientOption[]> => {
    const response = await api.get<any[]>("/users");
    return response  
      .filter((user: any) => user.role === "PATIENT")
      .map((user: any) => ({
        value: user.id,
        label: user.fullName || user.name || "Unknown Patient",
        phone: user.phoneNumber || user.phone || "N/A",
      }));
  },
};

export const medicineService = {
  getAllMedicines: async (): Promise<MedicineOption[]> => {
    const response = await api.get<any[]>("/v1/pharmacy/medicines");
    return response.map((med: any) => ({  
      value: med.id,
      label: `${med.name} (${med.category || 'General'})`,
      interactions: med.interactions || med.substituteMedicineCodes || [],
    }));
  },
};

export const prescriptionService = {
  getAllPrescriptions: async (): Promise<Prescription[]> => {
    const response = await api.get<Prescription[]>("/prescriptions");
    return response;  
  },
  
  getPrescriptionsByDoctorId: async (doctorId: string): Promise<Prescription[]> => {
    const response = await api.get<Prescription[]>(`/prescriptions/doctor/${doctorId}`);
    return response;  
  },
  
  getPrescriptionById: async (id: string): Promise<Prescription> => {
    const response = await api.get<Prescription>(`/prescriptions/${id}`);
    return response;  
  },
  
  createPrescription: async (data: CreatePrescriptionDTO): Promise<Prescription> => {
    const response = await api.post<Prescription>("/prescriptions", data);
    return response;  
  },
  
  updatePrescription: async (id: string, data: Partial<CreatePrescriptionDTO>): Promise<Prescription> => {
    const response = await api.put<Prescription>(`/prescriptions/${id}`, data);
    return response;  
  },
  
  deletePrescription: async (id: string): Promise<void> => {
    await api.delete<void>(`/prescriptions/${id}`);
  },
  
  downloadPrescription: async (id: string): Promise<Blob> => {
    const response = await api.get<Blob>(`/prescriptions/${id}/download`, { responseType: "blob" });
    return response;  
  },
  
  getPatientPrescriptions: async (patientId: string): Promise<Prescription[]> => {
    const response = await api.get<Prescription[]>(`/prescriptions/patient/${patientId}`);
    return response;  
  },
};