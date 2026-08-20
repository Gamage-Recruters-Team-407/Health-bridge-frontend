"use client";

import { FormEvent, useEffect, useState } from "react";
import { inventoryService } from "@/services/inventoryService";
import { HospitalInventory, InventoryRequest } from "@/types/inventory";

interface InventoryFormProps {
  item?: HospitalInventory | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const initialForm: InventoryRequest = {
  itemName: "",
  category: "",
  description: "",
  quantity: 0,
  unit: "",
  reorderLevel: 10,
  unitPrice: 0,
  supplierName: "",
};

export default function InventoryForm({ item, onSuccess, onCancel }: InventoryFormProps) {
  const [form, setForm] = useState<InventoryRequest>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setForm({
        itemName: item.itemName || "",
        category: item.category || "",
        description: item.description || "",
        quantity: item.quantity || 0,
        unit: item.unit || "",
        reorderLevel: item.reorderLevel || item.minimumStock || 10,
        unitPrice: item.unitPrice || item.unitCost || 0,
        supplierName: item.supplierName || item.supplier || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [item]);

  const updateField = (field: keyof InventoryRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.itemName.trim()) {
      setError("Item name is required.");
      return;
    }
    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }
    if (!form.unit.trim()) {
      setError("Unit is required.");
      return;
    }
    if (form.quantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }
    if (form.reorderLevel < 0) {
      setError("Reorder level cannot be negative.");
      return;
    }
    if (form.unitPrice < 0) {
      setError("Unit price cannot be negative.");
      return;
    }

    setLoading(true);

    try {
      if (item?.id) {
        await inventoryService.update(item.id, form);
      } else {
        await inventoryService.create(form);
      }

      onSuccess?.();
      if (!item) setForm(initialForm);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save inventory item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {item ? "Update Inventory Item" : "Add Inventory Item"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">Manage hospital supplies and stock.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Item Name</label>
          <input
            type="text"
            value={form.itemName}
            onChange={(e) => updateField("itemName", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Surgical Gloves"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Medical Supplies"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            min="0"
            value={form.quantity}
            onChange={(e) => updateField("quantity", Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Unit</label>
          <input
            type="text"
            value={form.unit}
            onChange={(e) => updateField("unit", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="boxes / pieces / bottles"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Reorder Level</label>
          <input
            type="number"
            min="0"
            value={form.reorderLevel}
            onChange={(e) => updateField("reorderLevel", Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Unit Price (Rs.)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.unitPrice}
            onChange={(e) => updateField("unitPrice", Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Supplier Name</label>
          <input
            type="text"
            value={form.supplierName}
            onChange={(e) => updateField("supplierName", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="ABC Medical Supplies"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Item description..."
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : item ? "Update Item" : "Add Item"}
        </button>
      </div>
    </form>
  );
}