export type InventoryStatus =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "EXPIRED";

export interface HospitalInventory {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  supplier: string;
  quantity: number;
  minimumStock: number;
  unit: string;
  unitCost: number;
  expiryDate: string;
  status: InventoryStatus;
}

export interface InventoryRequest {
  itemCode: string;
  itemName: string;
  category: string;
  supplier: string;
  quantity: number;
  minimumStock: number;
  unit: string;
  unitCost: number;
  expiryDate: string;
}