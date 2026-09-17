import { useSyncExternalStore, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getStoredUser, AuthUser, clearAuthData } from '@/lib/auth';

interface AuthSnapshot {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ✅ Cached snapshot — only ever replaced when the underlying data actually
// changes. useSyncExternalStore compares this by reference (Object.is), so
// returning a brand-new object literal on every call (as before) causes an
// infinite re-render loop.
let snapshot: AuthSnapshot = {
  user: null,
  token: null,
  isAuthenticated: false,
};

let listeners: (() => void)[] = [];

const getSnapshot = () => snapshot;

const subscribe = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((listener) => listener !== callback);
  };
};

const usersAreEqual = (a: AuthUser | null, b: AuthUser | null) => {
  if (a === b) return true;
  if (!a || !b) return false;
  return JSON.stringify(a) === JSON.stringify(b);
};

// ✅ Recompute auth state, and only swap in a new snapshot object (which
// triggers a re-render) when something actually changed.
const updateAuth = () => {
  const token = getToken();
  const userData = getStoredUser();

  const changed = token !== snapshot.token || !usersAreEqual(userData, snapshot.user);

  if (changed) {
    snapshot = {
      user: userData,
      token,
      isAuthenticated: !!token && !!userData,
    };
    listeners.forEach((listener) => listener());
  }
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