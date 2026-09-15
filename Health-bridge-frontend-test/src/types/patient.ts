export interface PatientProfile {
	id: string;
	fullName: string;
	email: string;
	phoneNumber?: string;
	role: string;
	provider?: string;
	picture?: string;
	dateOfBirth?: string;
	gender?: string;
	bloodGroup?: string;
	address?: string;
	emergencyContact?: string;
	medicalHistory?: string;
	createdAt?: string;
	updatedAt?: string;
}

export type UpdatePatientProfile = Partial<
	Omit<PatientProfile, "id" | "email" | "role">
>;
