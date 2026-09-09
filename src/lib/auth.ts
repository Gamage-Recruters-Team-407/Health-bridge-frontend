export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "PATIENT" | "ADMIN" | "SUPER_ADMIN" | "DOCTOR" | "PHARMACIST" | "INSURANCE_OFFICER" | "LAB_OFFICER";
}

const TOKEN_KEY = "healthbridge_token";
const USER_KEY = "healthbridge_user";
const TOKEN_COOKIE = "healthbridge_token";
const USER_COOKIE = "healthbridge_user";

const setCookie = (name: string, value: string, maxAgeInSeconds = 60 * 60 * 24 * 7) => {
  if (typeof document === "undefined") return;

  const isHttps = window.location.protocol === "https:";
  const securePart = isHttps ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeInSeconds}; SameSite=Lax${securePart}`;
};

const clearCookie = (name: string) => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};

export const saveAuthData = (token: string, user: AuthUser) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setCookie(TOKEN_COOKIE, token);
    setCookie(USER_COOKIE, JSON.stringify(user));
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    const localToken = localStorage.getItem(TOKEN_KEY);
    if (localToken) return localToken;

    const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  }
  return null;
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window !== "undefined") {
    const localData = localStorage.getItem(USER_KEY);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch {
        return null;
      }
    }

    const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${USER_COOKIE}=([^;]*)`));
    if (!cookieMatch) return null;

    try {
      return JSON.parse(decodeURIComponent(cookieMatch[1]));
    } catch {
      return null;
    }
  }
  return null;
};

export const clearAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    clearCookie(TOKEN_COOKIE);
    clearCookie(USER_COOKIE);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getRoleRedirectPath = (role: string): string => {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    case "DOCTOR":
      return "/doctor/dashboard";
    case "PHARMACIST":
      return "/pharmacist/dashboard";
    case "INSURANCE_OFFICER":
      return "/insurance-officer/dashboard";
    case "LAB_OFFICER":
      return "/laboratory/dashboard";
    case "PATIENT":
    default:
      return "/patient/dashboard";
  }
};