export type AppointmentStatus = "UPCOMING" | "COMPLETED" | "CANCELLED";

export type AppointmentMode = "IN_PERSON" | "VIDEO";

export interface DoctorAvailabilitySlot {
  id: string;
  time: string;
  label: string;
  isAvailable: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital?: string;
  consultationFee?: number;
  rating?: number;
  reviews?: number;
  avatarUrl?: string;
  about?: string;
  appointmentType?: AppointmentMode;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  hospital?: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: AppointmentMode;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface AppointmentFormValues {
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
}

export interface AppointmentFilters {
  status?: "ALL" | AppointmentStatus;
  query?: string;
}

export interface AppointmentSummary {
  upcoming: number;
  completed: number;
  cancelled: number;
}

export interface CancelAppointmentInput {
  appointmentId: string;
  reason?: string;
}
