export type InventoryStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "EXPIRED";

export interface HospitalInventory {
  id: string;
  itemCode?: string;
  itemName: string;
  category: string;
  description?: string;
  quantity: number;
  minimumStock?: number;
  reorderLevel?: number;
  unit: string;
  unitPrice: number;
  unitCost?: number;
  supplierName?: string;
  supplier?: string;
  expiryDate?: string;
  status?: InventoryStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryRequest {
  itemName: string;
  category: string;
  description?: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  unitPrice: number;
  supplierName?: string;
}