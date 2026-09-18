'use client';

import React, { useState } from 'react';
import { InvoiceRequest } from '@/types/hospital';

interface InvoiceFormProps {
  initialData?: Partial<InvoiceRequest>;
  onSubmit: (data: InvoiceRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<InvoiceRequest>({
    patientId: initialData?.patientId || '',
    patientName: initialData?.patientName || '',
    hospitalId: initialData?.hospitalId || '',
    issueDate: initialData?.issueDate || new Date().toISOString(),
    dueDate: initialData?.dueDate || '',
    discount: initialData?.discount ?? 0,
    tax: initialData?.tax ?? 0,
    paidAmount: initialData?.paidAmount ?? 0,
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.patientId.trim()) {
      newErrors.patientId = 'Patient ID is required';
    }
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient Name is required';
    }
    if (!formData.hospitalId.trim()) {
      newErrors.hospitalId = 'Hospital ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const submitData: InvoiceRequest = {
      patientId: formData.patientId.trim(),
      patientName: formData.patientName.trim(),
      hospitalId: formData.hospitalId.trim(),
      issueDate: formData.issueDate ? new Date(formData.issueDate).toISOString() : new Date().toISOString(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      discount: Number(formData.discount) || 0,
      tax: Number(formData.tax) || 0,
      paidAmount: Number(formData.paidAmount) || 0,
      notes: formData.notes?.trim() || '',
    };

    console.log('📤 Submitting invoice data:', JSON.stringify(submitData, null, 2));
    
    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('❌ Submit failed:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value ? new Date(value).toISOString() : '',
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Patient ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Patient ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            placeholder="PAT-001"
            className={`mt-1 block w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition ${
              errors.patientId ? 'border-red-500 border-2' : 'border-slate-200'
            }`}
          />
          {errors.patientId && (
            <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>
          )}
        </div>

        {/* Patient Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Patient Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="John Doe"
            className={`mt-1 block w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition ${
              errors.patientName ? 'border-red-500 border-2' : 'border-slate-200'
            }`}
          />
          {errors.patientName && (
            <p className="mt-1 text-sm text-red-600">{errors.patientName}</p>
          )}
        </div>

        {/* Hospital ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hospital ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="hospitalId"
            value={formData.hospitalId}
            onChange={handleChange}
            placeholder="HOSP-001"
            className={`mt-1 block w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition ${
              errors.hospitalId ? 'border-red-500 border-2' : 'border-slate-200'
            }`}
          />
          {errors.hospitalId && (
            <p className="mt-1 text-sm text-red-600">{errors.hospitalId}</p>
          )}
        </div>

        {/* Issue Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Issue Date</label>
          <input
            type="datetime-local"
            name="issueDate"
            value={formData.issueDate ? new Date(formData.issueDate).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleDateChange('issueDate', e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate ? new Date(formData.dueDate).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleDateChange('dueDate', e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>

        {/* ✅ Discount - LKR */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Discount (Rs.)
          </label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium pointer-events-none">
              Rs.
            </span>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              className="block w-full rounded-xl border border-slate-200 pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* ✅ Tax - LKR */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tax (Rs.)
          </label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium pointer-events-none">
              Rs.
            </span>
            <input
              type="number"
              name="tax"
              value={formData.tax}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              className="block w-full rounded-xl border border-slate-200 pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* ✅ Paid Amount - LKR */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Paid Amount (Rs.)
          </label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium pointer-events-none">
              Rs.
            </span>
            <input
              type="number"
              name="paidAmount"
              value={formData.paidAmount}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              className="block w-full rounded-xl border border-slate-200 pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enter amount in Sri Lankan Rupees (LKR)
          </p>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Additional notes about the invoice..."
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
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Creating...
            </>
          ) : (
            'Create Invoice'
          )}
        </button>
      </div>
    </form>
  );
};