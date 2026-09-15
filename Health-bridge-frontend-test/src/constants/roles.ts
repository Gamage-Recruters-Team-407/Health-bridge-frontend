import type { UserRole } from "@/types/auth";

export const USER_ROLES = {
	PATIENT: "PATIENT",
	ADMIN: "ADMIN",
	SUPER_ADMIN: "SUPER_ADMIN",
	DOCTOR: "DOCTOR",
	PHARMACIST: "PHARMACIST",
	INSURANCE_OFFICER: "INSURANCE_OFFICER",
	LAB_OFFICER: "LAB_OFFICER",
} as const satisfies Record<UserRole, UserRole>;

export const ROLE_LABELS: Record<UserRole, string> = {
	PATIENT: "Patient",
	ADMIN: "Admin",
	SUPER_ADMIN: "Super Admin",
	DOCTOR: "Doctor",
	PHARMACIST: "Pharmacist",
	INSURANCE_OFFICER: "Insurance Officer",
	LAB_OFFICER: "Laboratory Officer",
};

export const ROLE_SLUGS: Record<UserRole, string> = {
	PATIENT: "patient",
	ADMIN: "admin",
	SUPER_ADMIN: "super-admin",
	DOCTOR: "doctor",
	PHARMACIST: "pharmacist",
	INSURANCE_OFFICER: "insurance-officer",
	LAB_OFFICER: "lab-officer",
};
