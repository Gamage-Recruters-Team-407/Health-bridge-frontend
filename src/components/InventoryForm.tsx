"use client";

import { FormEvent, useEffect, useState } from "react";
import inventoryService, {
  HospitalInventory,
  InventoryRequest,
} from "@/services/inventoryService";

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

export default function InventoryForm({
  item,
  onSuccess,
  onCancel,
}: InventoryFormProps) {
  const [form, setForm] =
    useState<InventoryRequest>(initialForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setForm({
        itemName: item.itemName,
        category: item.category,
        description: item.description || "",
        quantity: item.quantity,
        unit: item.unit,
        reorderLevel: item.reorderLevel,
        unitPrice: item.unitPrice,
        supplierName: item.supplierName || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [item]);

  const updateField = (
    field: keyof InventoryRequest,
    value: string | number
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
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
        await inventoryService.update(
          item.id,
          form
        );
      } else {
        await inventoryService.create(form);
      }

      onSuccess?.();

      if (!item) {
        setForm(initialForm);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to save inventory item."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold">
          {item
            ? "Update Inventory Item"
            : "Add Inventory Item"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage hospital supplies and stock.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Item Name
          </label>

          <input
            type="text"
            value={form.itemName}
            onChange={(e) =>
              updateField("itemName", e.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Surgical Gloves"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Category
          </label>

          <input
            type="text"
            value={form.category}
            onChange={(e) =>
              updateField("category", e.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Medical Supplies"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Quantity
          </label>

          <input
            type="number"
            min="0"
            value={form.quantity}
            onChange={(e) =>
              updateField(
                "quantity",
                Number(e.target.value)
              )
            }
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Unit
          </label>

          <input
            type="text"
            value={form.unit}
            onChange={(e) =>
              updateField("unit", e.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
            placeholder="boxes / pieces / bottles"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Reorder Level
          </label>

          <input
            type="number"
            min="0"
            value={form.reorderLevel}
            onChange={(e) =>
              updateField(
                "reorderLevel",
                Number(e.target.value)
              )
            }
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Unit Price
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={form.unitPrice}
            onChange={(e) =>
              updateField(
                "unitPrice",
                Number(e.target.value)
              )
            }
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">
            Supplier Name
          </label>

          <input
            type="text"
            value={form.supplierName}
            onChange={(e) =>
              updateField(
                "supplierName",
                e.target.value
              )
            }
            className="w-full rounded-lg border px-3 py-2"
            placeholder="ABC Medical Supplies"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">
            Description
          </label>

          <textarea
            value={form.description}
            onChange={(e) =>
              updateField(
                "description",
                e.target.value
              )
            }
            rows={3}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Item description..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : item
            ? "Update Item"
            : "Add Item"}
        </button>
      </div>
    </form>
  );
}