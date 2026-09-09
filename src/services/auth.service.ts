import { apiClient } from "@/services/apiClient";
import { AuthUser } from "@/lib/auth";

const TOKEN_KEY = "healthbridge_token";
const USER_KEY = "healthbridge_user";

export interface LoginPayload {
  email: string;
  password: string;
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
  async login(payload: LoginPayload): Promise<AuthResponseData> {
    console.log('🔐 Logging in:', payload.email);
    const response = await apiClient.post<AuthResponseData>("/auth/login", payload);
    console.log('✅ Login response received');
    
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify({
        id: response.id,
        fullName: response.fullName,
        email: response.email,
        role: response.role,
      }));
      console.log('🔑 Token saved successfully');
      console.log('👤 User:', response.fullName);
    }
    
    return response;
  },

  // ... other methods
};