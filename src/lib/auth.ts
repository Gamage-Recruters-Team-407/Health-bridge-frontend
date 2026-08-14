export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "PATIENT" | "ADMIN" | "DOCTOR" | "PHARMACIST" | "INSURANCE_OFFICER";
}

const TOKEN_KEY = "healthbridge_token";
const USER_KEY = "healthbridge_user";

export const saveAuthData = (token: string, user: AuthUser) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(USER_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
  }
  return null;
};

export const clearAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getRoleRedirectPath = (role: string): string => {
  switch (role) {
    case "ADMIN":
      return "/patient/dashboard"; // As requested, redirect to placeholder page
    case "DOCTOR":
      return "/patient/dashboard";
    case "PHARMACIST":
      return "/patient/dashboard";
    case "INSURANCE_OFFICER":
      return "/patient/dashboard";
    case "PATIENT":
    default:
      return "/patient/dashboard";
  }
};
