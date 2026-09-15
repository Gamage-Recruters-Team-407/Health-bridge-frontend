import type { UserRole } from "@/types/auth";

export const ROUTES = {
	home: "/",
	login: "/login",
	register: "/register",
	forgotPassword: "/forgot-password",
	verifyOtp: "/verify-otp",
	resetPassword: "/reset-password",
	dashboard: {
		PATIENT: "/patient/dashboard",
		ADMIN: "/admin/dashboard",
		SUPER_ADMIN: "/super-admin/dashboard",
		DOCTOR: "/doctor/dashboard",
		PHARMACIST: "/pharmacist/dashboard",
		INSURANCE_OFFICER: "/insurance-officer/dashboard",
		LAB_OFFICER: "/lab-officer/dashboard",
	},
} as const;

export const PUBLIC_ROUTES = [
	ROUTES.home,
	ROUTES.login,
	ROUTES.register,
	ROUTES.forgotPassword,
	ROUTES.verifyOtp,
	ROUTES.resetPassword,
] as const;

export const ROLE_ROUTE_MAP: Record<UserRole, string> = ROUTES.dashboard;
