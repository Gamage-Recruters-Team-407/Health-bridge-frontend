export const USER_ROLES = [
	"PATIENT",
	"ADMIN",
	"SUPER_ADMIN",
	"DOCTOR",
	"PHARMACIST",
	"INSURANCE_OFFICER",
	"LAB_OFFICER",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface AuthUser {
	id: string;
	fullName: string;
	email: string;
	role: UserRole;
}

export interface AuthResponseData {
	token: string;
	id: string;
	fullName: string;
	email: string;
	role: UserRole;
	message?: string;
}
