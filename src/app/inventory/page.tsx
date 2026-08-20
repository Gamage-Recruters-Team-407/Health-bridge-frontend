"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { inventoryService } from "@/services/inventoryService";
import { HospitalInventory } from "@/types/inventory";

export default function InventoryPage() {
  const [items, setItems] = useState<HospitalInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);
      setError("");
      const data = await inventoryService.getAll();
      setItems(data);
    } catch (error: any) {
      console.error("Failed to load inventory:", error);
      setError(error?.response?.data?.message || error?.message || "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }

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

  const lowStock = items.filter((item) => {
    const qty = item.quantity || 0;
    const reorder = item.reorderLevel || item.minimumStock || 10;
    return qty <= reorder && qty > 0;
  }).length;

  const outOfStock = items.filter((item) => (item.quantity || 0) <= 0).length;

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <p className="text-lg font-semibold">⚠️ Error</p>
          <p className="mt-2 text-sm">{error}</p>
          <button
            onClick={() => loadInventory()}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Inventory</h1>
          <p className="text-sm text-gray-500">Manage hospital supplies and stock</p>
        </div>

        <Link
          href="/hospital/inventory/create"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Add Supply
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Items</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">{items.length}</h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Low Stock</p>
          <h2 className="mt-1 text-2xl font-bold text-yellow-600">{lowStock}</h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <h2 className="mt-1 text-2xl font-bold text-red-600">{outOfStock}</h2>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3.5 font-medium text-gray-600">Code</th>
                <th className="px-4 py-3.5 font-medium text-gray-600">Item</th>
                <th className="px-4 py-3.5 font-medium text-gray-600">Category</th>
                <th className="px-4 py-3.5 font-medium text-gray-600">Quantity</th>
                <th className="px-4 py-3.5 font-medium text-gray-600">Unit</th>
                <th className="px-4 py-3.5 font-medium text-gray-600">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Loading inventory...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const status = getStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3.5 font-mono text-sm text-gray-500">
                        {item.itemCode || item.id.slice(0, 6)}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-medium text-gray-900">{item.itemName}</div>
                        {item.supplierName && (
                          <div className="text-xs text-gray-500">{item.supplierName}</div>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-gray-600">{item.category}</td>

                      <td className="px-4 py-3.5 font-medium text-gray-900">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-3.5 text-gray-600">{item.unit}</td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}