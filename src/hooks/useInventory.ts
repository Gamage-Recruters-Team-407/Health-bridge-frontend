import { useState, useEffect, useCallback, useRef } from 'react';
import { inventoryService } from '@/services/inventoryService';
import { HospitalInventory, HospitalInventoryRequest } from '@/types/hospital';

const TOKEN_KEY = "healthbridge_token";

const isLoginPage = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname === '/login' || window.location.pathname === '/';
};

export const useInventory = () => {
  const [inventory, setInventory] = useState<HospitalInventory[]>([]);
  const [lowStockItems, setLowStockItems] = useState<HospitalInventory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const hasFetched = useRef(false);

  const fetchAllInventory = useCallback(async () => {
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
      const data = await inventoryService.getAllInventory();
      if (isMounted.current) {
        setInventory(data);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch inventory';
      if (isMounted.current) {
        setError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const fetchLowStock = useCallback(async () => {
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
      const data = await inventoryService.getLowStockItems();
      if (isMounted.current) {
        setLowStockItems(data);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch low stock items';
      if (isMounted.current) {
        setError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const createInventoryItem = useCallback(async (data: HospitalInventoryRequest): Promise<HospitalInventory> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      const newItem = await inventoryService.createInventory(data);
      if (isMounted.current) {
        setInventory((prev) => [...prev, newItem]);
      }
      return newItem;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create inventory item';
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

  const updateInventoryItem = useCallback(async (id: string, data: HospitalInventoryRequest): Promise<HospitalInventory> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      const updated = await inventoryService.updateInventory(id, data);
      if (isMounted.current) {
        setInventory((prev) =>
          prev.map((item) => (item.id === id ? updated : item))
        );
      }
      return updated;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update inventory item';
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

  const deleteInventoryItem = useCallback(async (id: string): Promise<void> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      await inventoryService.deleteInventory(id);
      if (isMounted.current) {
        setInventory((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete inventory item';
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

  const getHospitalInventory = useCallback(async (hospitalId: string): Promise<HospitalInventory[]> => {
    if (!isMounted.current) throw new Error('Component unmounted');
    setLoading(true);
    setError(null);
    
    try {
      return await inventoryService.getHospitalInventory(hospitalId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hospital inventory';
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
      fetchAllInventory();
      fetchLowStock();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchAllInventory, fetchLowStock]);

  return {
    inventory,
    lowStockItems,
    loading,
    error,
    fetchAllInventory,
    fetchLowStock,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getHospitalInventory,
  };
};