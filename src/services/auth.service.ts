import api from "@/lib/axios";
import { AuthUser } from "@/lib/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface AuthResponseData {
  token: string;
  id: string;
  fullName: string;
  email: string;
  role: AuthUser["role"];
  message: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    const response = await api.post<AuthResponseData>("/auth/register", payload);
    return response.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponseData> {
    const response = await api.post<AuthResponseData>("/auth/login", payload);
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>("/auth/forgot-password", { email });
    return response.data;
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<{ valid: boolean; message: string }> {
    const response = await api.post<{ valid: boolean; message: string }>("/auth/verify-otp", payload);
    return response.data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<AuthResponseData> {
    const response = await api.post<AuthResponseData>("/auth/reset-password", payload);
    return response.data;
  },

  async googleAuth(token: string, email?: string, name?: string): Promise<AuthResponseData> {
    const response = await api.post<AuthResponseData>("/auth/google", {
      token,
      email,
      name,
    });
    return response.data;
  },
};
