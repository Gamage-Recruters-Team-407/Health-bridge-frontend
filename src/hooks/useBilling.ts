'use client';

import {
  useSyncExternalStore,
  useEffect,
} from 'react';

import { invoiceService } from '@/services/billingService';
import { Invoice } from '@/types/hospital';

// ============================================================
// Types
// ============================================================

type Listener = () => void;

// ============================================================
// Constants
// ============================================================

const TOKEN_KEY = 'healthbridge_token';

// ============================================================
// Store State
// ============================================================

let invoices: Invoice[] = [];

let loading = true;

let error: string | null = null;

// ============================================================
// Listeners
// ============================================================

let listeners: Listener[] = [];

// ============================================================
// Initialization
// ============================================================

let initialized = false;

let fetchPromise: Promise<void> | null = null;

// ============================================================
// Snapshot
// ============================================================

// IMPORTANT:
// useSyncExternalStore requires a cached snapshot.
// Do NOT return { invoices, loading, error } directly
// from getSnapshot(), because that creates a new object
// every time.

let snapshot: {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
} = {
  invoices,
  loading,
  error,
};

// ============================================================
// Notify Subscribers
// ============================================================

const emitChange = () => {
  // Update the cached snapshot only when store data changes.
  snapshot = {
    invoices,
    loading,
    error,
  };

  listeners.forEach((listener) => {
    listener();
  });
};

// ============================================================
// Subscribe
// ============================================================

const subscribe = (listener: Listener) => {
  listeners = [...listeners, listener];

  return () => {
    listeners = listeners.filter(
      (existingListener) =>
        existingListener !== listener
    );
  };
};

// ============================================================
// Get Snapshot
// ============================================================

const getSnapshot = () => {
  return snapshot;
};

// ============================================================
// Server Snapshot
// ============================================================

// Needed for Next.js SSR / hydration.

const getServerSnapshot = () => {
  return snapshot;
};

// ============================================================
// Login Page Check
// ============================================================

const isLoginPage = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.location.pathname === '/login' ||
    window.location.pathname === '/'
  );
};

// ============================================================
// Fetch Billing Data
// ============================================================

const fetchData = async (): Promise<void> => {
  // Prevent duplicate requests.
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      // --------------------------------------------------------
      // Check Browser
      // --------------------------------------------------------

      if (typeof window === 'undefined') {
        return;
      }

      // --------------------------------------------------------
      // Check Login Page
      // --------------------------------------------------------

      if (isLoginPage()) {
        console.log(
          '⏳ Billing Store: On login page'
        );

        loading = false;
        error = null;

        emitChange();

        return;
      }

      // --------------------------------------------------------
      // Check Token
      // --------------------------------------------------------

      const token =
        localStorage.getItem(TOKEN_KEY);

      if (!token) {
        console.warn(
          '⚠️ Billing Store: No authentication token found'
        );

        invoices = [];
        loading = false;
        error = null;

        emitChange();

        return;
      }

      // --------------------------------------------------------
      // Start Loading
      // --------------------------------------------------------

      console.log(
        '🚀 Billing Store: Fetching invoices...'
      );

      loading = true;
      error = null;

      emitChange();

      // --------------------------------------------------------
      // API Request
      // --------------------------------------------------------

      const data =
        await invoiceService.getAllInvoices();

      console.log(
        '✅ Billing Store: Invoices received:',
        data?.length || 0
      );

      // --------------------------------------------------------
      // Save Data
      // --------------------------------------------------------

      invoices = data || [];

      loading = false;
      error = null;

      emitChange();

      console.log(
        '✅ Billing Store: Loading completed'
      );
    } catch (err: unknown) {
      console.error(
        '❌ Billing Store: Failed to fetch invoices',
        err
      );

      error =
        err instanceof Error
          ? err.message
          : 'Failed to fetch invoices';

      loading = false;

      emitChange();
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

// ============================================================
// Force Refresh
// ============================================================

const refreshData = async (): Promise<void> => {
  console.log(
    '🔄 Billing Store: Refreshing invoices...'
  );

  // Allow a new request.
  initialized = false;

  await fetchData();

  initialized = true;
};

// ============================================================
// Initialize Store
// ============================================================

const initializeStore = () => {
  if (initialized) {
    return;
  }

  initialized = true;

  console.log(
    '🔧 Billing Store: Initializing...'
  );

  void fetchData();
};

// ============================================================
// Hook
// ============================================================

export const useBillingStore = () => {
  const store = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // ----------------------------------------------------------
  // Initialize external store
  // ----------------------------------------------------------

  useEffect(() => {
    initializeStore();
  }, []);

  return {
    ...store,

    // --------------------------------------------------------
    // Refresh
    // --------------------------------------------------------

    refreshData,
  };
};