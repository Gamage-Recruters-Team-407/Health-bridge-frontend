export type AppointmentStatus = "UPCOMING" | "COMPLETED" | "CANCELLED";

export interface Appointment {
	id: string;
	patientId?: string;
	doctorId: string;
	doctorName?: string;
	appointmentDate: string;
	appointmentTime: string;
	appointmentType?: string;
	reason?: string;
	status: AppointmentStatus;
	createdAt?: string;
	updatedAt?: string;
}

export interface AppointmentFilters {
	status?: AppointmentStatus;
	from?: string;
	to?: string;
}

export interface AppointmentInput {
	doctorId: string;
	appointmentDate: string;
	appointmentTime: string;
	appointmentType?: string;
	reason?: string;
}
