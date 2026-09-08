import { useState, useEffect, useCallback } from 'react';
import { invoiceService, billingItemService } from '@/services/billingService';
import { Invoice, InvoiceRequest, BillingItem, BillingItemRequest } from '@/types/hospital';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invoiceService.getAllInvoices();
      setInvoices(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invoices';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createInvoice = useCallback(async (data: InvoiceRequest): Promise<Invoice> => {
    setLoading(true);
    setError(null);
    try {
      const newInvoice = await invoiceService.createInvoice(data);
      setInvoices((prev) => [...prev, newInvoice]);
      return newInvoice;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInvoice = useCallback(async (id: string, data: InvoiceRequest): Promise<Invoice> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await invoiceService.updateInvoice(id, data);
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? updated : inv))
      );
      return updated;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invoice';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInvoice = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await invoiceService.deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete invoice';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPatientInvoices = useCallback(async (patientId: string): Promise<Invoice[]> => {
    setLoading(true);
    setError(null);
    try {
      return await invoiceService.getPatientInvoices(patientId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch patient invoices';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetching on mount is intentional; the callback manages loading and error state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllInvoices();
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

  const fetchAllItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await billingItemService.getAllBillingItems();
      setItems(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch billing items';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(async (data: BillingItemRequest): Promise<BillingItem> => {
    setLoading(true);
    setError(null);
    try {
      const newItem = await billingItemService.createBillingItem(data);
      setItems((prev) => [...prev, newItem]);
      return newItem;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create billing item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (id: string, data: BillingItemRequest): Promise<BillingItem> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await billingItemService.updateBillingItem(id, data);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update billing item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await billingItemService.deleteBillingItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete billing item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInvoiceItems = useCallback(async (invoiceId: string): Promise<BillingItem[]> => {
    setLoading(true);
    setError(null);
    try {
      return await billingItemService.getInvoiceItems(invoiceId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invoice items';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetching on mount is intentional; the callback manages loading and error state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllItems();
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