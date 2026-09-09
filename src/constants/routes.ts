export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  otp: "/otp",
  resetPassword: "/reset-password",
  dashboard: {
    patient: "/patient/dashboard",
    doctor: "/doctor/dashboard",
    admin: "/admin/dashboard",
    superAdmin: "/super-admin/dashboard",
    pharmacist: "/pharmacist/dashboard",
    insuranceOfficer: "/insurance-officer/dashboard",
    labOfficer: "/lab-officer/dashboard",
  },
  appointments: {
    searchDoctor: "/appointments/search-doctor",
    book: "/appointments/book",
    list: "/appointments",
    details: (id: string) => `/appointments/${id}`,
  },
  profile: {
    patient: "/patient/profile",
  },
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.home,
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.otp,
  ROUTES.resetPassword,
  ROUTES.appointments.searchDoctor,
];

export const ROLE_ROUTE_MAP: Record<string, string> = {
  PATIENT: ROUTES.dashboard.patient,
  ADMIN: ROUTES.dashboard.admin,
  SUPER_ADMIN: ROUTES.dashboard.superAdmin,
  DOCTOR: ROUTES.dashboard.doctor,
  PHARMACIST: ROUTES.dashboard.pharmacist,
  INSURANCE_OFFICER: ROUTES.dashboard.insuranceOfficer,
  LAB_OFFICER: ROUTES.dashboard.labOfficer,
};
