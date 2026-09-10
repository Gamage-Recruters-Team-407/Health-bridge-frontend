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

    // ✅ Prepare data for backend
    const submitData: InvoiceRequest = {
      patientId: formData.patientId.trim(),
      patientName: formData.patientName.trim(),
      hospitalId: formData.hospitalId.trim(),
      // Backend expects ISO string for dates
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
    
    // Clear error for this field
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
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.patientId ? 'border-red-500 border-2' : 'border-gray-300'
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
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.patientName ? 'border-red-500 border-2' : 'border-gray-300'
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
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.hospitalId ? 'border-red-500 border-2' : 'border-gray-300'
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount ($)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Tax */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax ($)</label>
          <input
            type="number"
            name="tax"
            value={formData.tax}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Paid Amount */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Paid Amount ($)</label>
          <input
            type="number"
            name="paidAmount"
            value={formData.paidAmount}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
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