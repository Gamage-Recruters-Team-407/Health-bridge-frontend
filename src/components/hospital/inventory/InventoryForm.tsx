"use client";

import React, { useState } from 'react';
import { HospitalInventoryRequest } from '@/types/hospital';

interface InventoryFormProps {
  initialData?: Partial<HospitalInventoryRequest>;
  onSubmit: (data: HospitalInventoryRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<HospitalInventoryRequest>({
    hospitalId: initialData?.hospitalId || '',
    itemCode: initialData?.itemCode || '',
    itemName: initialData?.itemName || '',
    category: initialData?.category || '',
    quantity: initialData?.quantity || 0,
    reorderLevel: initialData?.reorderLevel || 0,
    unit: initialData?.unit || '',
    supplier: initialData?.supplier || '',
    expiryDate: initialData?.expiryDate || '',
    unitCost: initialData?.unitCost || 0,
    location: initialData?.location || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'reorderLevel' || name === 'unitCost'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Hospital ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="hospitalId"
            value={formData.hospitalId}
            onChange={handleChange}
            required
            placeholder="HOSP-001"
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Item Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="itemCode"
            value={formData.itemCode}
            onChange={handleChange}
            required
            placeholder="MED-001"
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Item Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
            placeholder="Paracetamol 500mg"
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="Medicine, Equipment, Supply..."
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Reorder Level <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="reorderLevel"
            value={formData.reorderLevel}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Unit <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
            placeholder="tablets, pcs, kg, ml..."
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Supplier</label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            placeholder="Supplier Name"
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Unit Cost <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="unitCost"
            value={formData.unitCost}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Shelf A-1, Room 2, Storage..."
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Saving...
            </>
          ) : (
            'Add Item'
          )}
        </button>
      </div>
    </form>
  );
};