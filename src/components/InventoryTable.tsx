"use client";

import { useEffect, useState } from "react";
import { inventoryService } from "@/services/inventoryService";
import { HospitalInventory } from "@/types/inventory";

interface InventoryTableProps {
  onEdit?: (item: HospitalInventory) => void;
  onStock?: (item: HospitalInventory) => void;
  refresh?: number;
}

export default function InventoryTable({ onEdit, onStock, refresh }: InventoryTableProps) {
  const [items, setItems] = useState<HospitalInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await inventoryService.getAll();
      setItems(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [refresh]);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this inventory item?")) return;

    try {
      await inventoryService.delete(id);
      loadInventory();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete item.");
    }
  };

  const getStatus = (item: HospitalInventory) => {
    const qty = item.quantity || 0;
    const reorder = item.reorderLevel || item.minimumStock || 10;

    if (qty <= 0) {
      return { label: "OUT OF STOCK", className: "bg-red-100 text-red-700" };
    }
    if (qty <= reorder) {
      return { label: "LOW STOCK", className: "bg-yellow-100 text-yellow-700" };
    }
    return { label: "IN STOCK", className: "bg-green-100 text-green-700" };
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading inventory...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-4 font-medium text-gray-600">Item</th>
              <th className="px-5 py-4 font-medium text-gray-600">Category</th>
              <th className="px-5 py-4 font-medium text-gray-600">Quantity</th>
              <th className="px-5 py-4 font-medium text-gray-600">Unit Price</th>
              <th className="px-5 py-4 font-medium text-gray-600">Status</th>
              <th className="px-5 py-4 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                  No inventory items found.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const status = getStatus(item);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{item.itemName}</div>
                      {item.supplierName && (
                        <div className="text-xs text-gray-500">{item.supplierName}</div>
                      )}
                    </td>

                    <td className="px-5 py-4 text-gray-600">{item.category}</td>

                    <td className="px-5 py-4 text-gray-900">
                      {item.quantity} {item.unit}
                    </td>

                    <td className="px-5 py-4 text-gray-900">
                      Rs. {Number(item.unitPrice || item.unitCost || 0).toFixed(2)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        {onStock && (
                          <button
                            onClick={() => onStock(item)}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                          >
                            Stock
                          </button>
                        )}

                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}