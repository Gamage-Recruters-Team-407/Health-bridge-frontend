import api from "@/lib/axios";
import {
  HospitalInventory,
  InventoryRequest
} from "../types/inventory";

export const inventoryService = {

  async getAll(): Promise<HospitalInventory[]> {

    const response =
      await api.get(
        "/hospital-billing/inventory"
      );

    return response.data;
  },

  async getById(
    id: string
  ): Promise<HospitalInventory> {

    const response =
      await api.get(
        `/hospital-billing/inventory/${id}`
      );

    return response.data;
  },

  async create(
    data: InventoryRequest
  ): Promise<HospitalInventory> {

    const response =
      await api.post(
        "/hospital-billing/inventory",
        data
      );

    return response.data;
  },

  async update(
    id: string,
    data: InventoryRequest
  ): Promise<HospitalInventory> {

    const response =
      await api.put(
        `/hospital-billing/inventory/${id}`,
        data
      );

    return response.data;
  },

  async delete(id: string): Promise<void> {

    await api.delete(
      `/hospital-billing/inventory/${id}`
    );
  },

  async stockIn(
    id: string,
    quantity: number
  ) {

    const response =
      await api.patch(
        `/hospital-billing/inventory/${id}/stock-in/${quantity}`
      );

    return response.data;
  },

  async stockOut(
    id: string,
    quantity: number
  ) {

    const response =
      await api.patch(
        `/hospital-billing/inventory/${id}/stock-out/${quantity}`
      );

    return response.data;
  },

  async getLowStock() {

    const response =
      await api.get(
        "/hospital-billing/inventory/low-stock"
      );

    return response.data;
  },
};