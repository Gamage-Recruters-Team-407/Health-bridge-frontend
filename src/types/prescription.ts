export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: string;
  status: "active" | "completed" | "cancelled";
  items: PrescriptionItem[];
  notes?: string;
  validUntil: string;
}

export interface PrescriptionItem {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  interactions: string[];
}

export interface CreatePrescriptionDTO {
  patientName: string;
  patientPhone: string;
  notes: string;
  items: PrescriptionItem[];
  validDays: number;
}

export interface DrugInteraction {
  medicine1: string;
  medicine2: string;
  severity: "mild" | "moderate" | "severe";
  description: string;
}