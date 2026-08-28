"use client";

import { FormEvent, useState } from "react";
import inventoryService, {
  HospitalInventory,
} from "@/services/inventoryService";

interface StockModalProps {
  item: HospitalInventory | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function StockModal({
  item,
  onClose,
  onSuccess,
}: StockModalProps) {
  const [type, setType] = useState<
    "IN" | "OUT"
  >("IN");

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!item) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (quantity <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    if (
      type === "OUT" &&
      quantity > item.quantity
    ) {
      setError(
        "Stock-out quantity cannot exceed available stock."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (!item.id) {
        throw new Error("Inventory item ID is missing.");
      }

      if (type === "IN") {
        await inventoryService.addStock(
          item.id,
          quantity
        );
      } else {
        await inventoryService.removeStock(
          item.id,
          quantity
        );
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update stock."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Update Stock
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {item.itemName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        <div className="mt-5 rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between text-sm">
            <span>Current Stock</span>
            <span className="font-semibold">
              {item.quantity} {item.unit}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Transaction Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("IN")}
                className={`rounded-lg border px-4 py-3 ${
                  type === "IN"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : ""
                }`}
              >
                Stock In
              </button>

              <button
                type="button"
                onClick={() => setType("OUT")}
                className={`rounded-lg border px-4 py-3 ${
                  type === "OUT"
                    ? "border-red-600 bg-red-50 text-red-700"
                    : ""
                }`}
              >
                Stock Out
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`rounded-lg px-5 py-2 font-medium text-white ${
                type === "IN"
                  ? "bg-green-600"
                  : "bg-red-600"
              } disabled:opacity-50`}
            >
              {loading
                ? "Updating..."
                : type === "IN"
                ? "Add Stock"
                : "Remove Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}