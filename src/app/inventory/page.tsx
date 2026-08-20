"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { inventoryService }
  from "@/services/inventoryService";

import {
  HospitalInventory
} from "@/types/inventory";

export default function InventoryPage() {

  const [items, setItems] =
    useState<HospitalInventory[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadInventory();

  }, []);

  async function loadInventory() {

    try {

      const data =
        await inventoryService.getAll();

      setItems(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  }

  const lowStock =
    items.filter(
      item =>
        item.status === "LOW_STOCK"
    ).length;

  const outOfStock =
    items.filter(
      item =>
        item.status === "OUT_OF_STOCK"
    ).length;

  return (

    <div className="p-6">

      <div className="flex justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            Hospital Inventory
          </h1>

          <p className="text-gray-500">
            Manage hospital supplies and stock
          </p>
        </div>

        <Link
          href="/hospital/inventory/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          + Add Supply
        </Link>

      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="border rounded-xl p-5">
          <p>Total Items</p>
          <h2 className="text-2xl font-bold">
            {items.length}
          </h2>
        </div>

        <div className="border rounded-xl p-5">
          <p>Low Stock</p>
          <h2 className="text-2xl font-bold">
            {lowStock}
          </h2>
        </div>

        <div className="border rounded-xl p-5">
          <p>Out of Stock</p>
          <h2 className="text-2xl font-bold">
            {outOfStock}
          </h2>
        </div>

      </div>

      <div className="border rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">
                Code
              </th>

              <th className="p-3 text-left">
                Item
              </th>

              <th className="p-3 text-left">
                Category
              </th>

              <th className="p-3 text-left">
                Quantity
              </th>

              <th className="p-3 text-left">
                Minimum
              </th>

              <th className="p-3 text-left">
                Status
              </th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={6}
                  className="p-5 text-center"
                >
                  Loading...
                </td>
              </tr>

            ) : (

              items.map(item => (

                <tr
                  key={item.id}
                  className="border-t"
                >

                  <td className="p-3">
                    {item.itemCode}
                  </td>

                  <td className="p-3">
                    {item.itemName}
                  </td>

                  <td className="p-3">
                    {item.category}
                  </td>

                  <td className="p-3">
                    {item.quantity} {item.unit}
                  </td>

                  <td className="p-3">
                    {item.minimumStock}
                  </td>

                  <td className="p-3">
                    {item.status}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}