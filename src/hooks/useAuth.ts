import { useSyncExternalStore, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getStoredUser, AuthUser, clearAuthData } from '@/lib/auth';

// ✅ Store for auth state
let currentUser: AuthUser | null = null;
let currentToken: string | null = null;
let listeners: (() => void)[] = [];

const getSnapshot = () => {
  return {
    user: currentUser,
    token: currentToken,
    isAuthenticated: !!currentToken && !!currentUser,
  };
};

const subscribe = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((listener) => listener !== callback);
  };
};

// ✅ Update auth state
const updateAuth = () => {
  const token = getToken();
  const userData = getStoredUser();
  
  currentToken = token;
  currentUser = userData;
  
  // Notify all listeners
  listeners.forEach((listener) => listener());
};

// ✅ Initialize auth state
if (typeof window !== 'undefined') {
  updateAuth();
}

export const useAuth = () => {
  const router = useRouter();
  
  // ✅ Use useSyncExternalStore for reactive state
  const state = useSyncExternalStore(subscribe, getSnapshot);

  const logout = useCallback(() => {
    clearAuthData();
    updateAuth();
    router.push('/login');
  }, [router]);

  return {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: false,
    logout,
  };
};

export default useAuth;