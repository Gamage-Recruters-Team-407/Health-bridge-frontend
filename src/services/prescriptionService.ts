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
  
  deletePrescription: async (id: string): Promise<void> => {
    await api.delete<void>(`/prescriptions/${id}`);
  },
  
  downloadPrescription: async (id: string): Promise<Blob> => {
    return await api.get<Blob>(`/prescriptions/${id}/download`, { responseType: "blob" });
  },
  
  // ✅ FIXED: Patient ID එක හරියට යවනවා
  getPatientPrescriptions: async (patientId: string): Promise<Prescription[]> => {
    console.log("Fetching prescriptions for patient ID:", patientId); // Debug
    const response = await api.get<Prescription[]>(`/prescriptions/patient/${patientId}`);
    console.log("Received prescriptions:", response); // Debug
    return response;
  },
};