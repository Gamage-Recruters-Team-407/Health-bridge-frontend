import { useState, useEffect, useCallback } from 'react';
import { inventoryService } from '@/services/inventoryService';
import { HospitalInventory, HospitalInventoryRequest } from '@/types/hospital';

export const useInventory = () => {
  const [inventory, setInventory] = useState<HospitalInventory[]>([]);
  const [lowStockItems, setLowStockItems] = useState<HospitalInventory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getAllInventory();
      setInventory(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLowStock = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getLowStockItems();
      setLowStockItems(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch low stock items');
    } finally {
      setLoading(false);
    }
  }, []);

  const createInventoryItem = useCallback(async (data: HospitalInventoryRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newItem = await inventoryService.createInventory(data);
      setInventory((prev) => [...prev, newItem]);
      return newItem;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create inventory item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInventoryItem = useCallback(async (id: string, data: HospitalInventoryRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await inventoryService.updateInventory(id, data);
      setInventory((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update inventory item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInventoryItem = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await inventoryService.deleteInventory(id);
      setInventory((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete inventory item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHospitalInventory = useCallback(async (hospitalId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await inventoryService.getHospitalInventory(hospitalId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hospital inventory');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchAllInventory();
      void fetchLowStock();
    }, 0);

    return () => clearTimeout(timeoutId);
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