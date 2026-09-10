import { useState, useCallback, useRef, useEffect } from 'react';
import { invoiceService, billingItemService } from '@/services/billingService';
import { Invoice, InvoiceRequest, BillingItem, BillingItemRequest } from '@/types/hospital';

const TOKEN_KEY = "healthbridge_token";

// Helper to check if we're on login page
const isLoginPage = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname === '/login' || window.location.pathname === '/';
};

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const hasFetched = useRef(false);

  const fetchAllInvoices = useCallback(async () => {
    // Skip if on login page
    if (isLoginPage()) {
      console.log('⏳ On login page - Skipping API call');
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.log('⏳ No token found - Skipping API call');
      return;
    }

    if (!isMounted.current) return;
    setLoading(true);
    setError(null);
    
    try {
      const data = await invoiceService.getAllInvoices();
      if (isMounted.current) {
        setInvoices(data);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invoices';
      if (isMounted.current) {
        setError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const createInvoice = useCallback(async (data: InvoiceRequest): Promise<Invoice> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      const newInvoice = await invoiceService.createInvoice(data);
      if (isMounted.current) {
        setInvoices((prev) => [...prev, newInvoice]);
      }
      return newInvoice;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice';
      if (isMounted.current) {
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const updateInvoice = useCallback(async (id: string, data: InvoiceRequest): Promise<Invoice> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      const updated = await invoiceService.updateInvoice(id, data);
      if (isMounted.current) {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === id ? updated : inv))
        );
      }
      return updated;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invoice';
      if (isMounted.current) {
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const deleteInvoice = useCallback(async (id: string): Promise<void> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      await invoiceService.deleteInvoice(id);
      if (isMounted.current) {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete invoice';
      if (isMounted.current) {
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const getPatientInvoices = useCallback(async (patientId: string): Promise<Invoice[]> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      return await invoiceService.getPatientInvoices(patientId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch patient invoices';
      if (isMounted.current) {
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // ✅ Effect only runs once - fetch data
  useEffect(() => {
    if (!isLoginPage() && !hasFetched.current) {
      hasFetched.current = true;
      fetchAllInvoices();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchAllInvoices]);

  return {
    invoices,
    loading,
    error,
    fetchAllInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getPatientInvoices,
  };
};

export const useBillingItems = () => {
  const [items, setItems] = useState<BillingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const hasFetched = useRef(false);

  const fetchAllItems = useCallback(async () => {
    // Skip if on login page
    if (isLoginPage()) {
      console.log('⏳ On login page - Skipping API call');
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.log('⏳ No token found - Skipping API call');
      return;
    }

    if (!isMounted.current) return;
    setLoading(true);
    setError(null);
    
    try {
      const data = await billingItemService.getAllBillingItems();
      if (isMounted.current) {
        setItems(data);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch billing items';
      if (isMounted.current) {
        setError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const createItem = useCallback(async (data: BillingItemRequest): Promise<BillingItem> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      const newItem = await billingItemService.createBillingItem(data);
      if (isMounted.current) {
        setItems((prev) => [...prev, newItem]);
      }
      return newItem;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create billing item';
      if (isMounted.current) {
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const updateItem = useCallback(async (id: string, data: BillingItemRequest): Promise<BillingItem> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      const updated = await billingItemService.updateBillingItem(id, data);
      if (isMounted.current) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? updated : item))
        );
      }
      return updated;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update billing item';
      if (isMounted.current) {
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      await billingItemService.deleteBillingItem(id);
      if (isMounted.current) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete billing item';
      if (isMounted.current) {
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const getInvoiceItems = useCallback(async (invoiceId: string): Promise<BillingItem[]> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      return await billingItemService.getInvoiceItems(invoiceId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invoice items';
      if (isMounted.current) {
        setError(errorMessage);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // ✅ Effect only runs once
  useEffect(() => {
    if (!isLoginPage() && !hasFetched.current) {
      hasFetched.current = true;
      fetchAllItems();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchAllItems]);

  return {
    items,
    loading,
    error,
    fetchAllItems,
    createItem,
    updateItem,
    deleteItem,
    getInvoiceItems,
  };
};