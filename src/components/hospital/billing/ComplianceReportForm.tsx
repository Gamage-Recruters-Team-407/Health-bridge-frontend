"use client";

import React, { useState } from 'react';
import { ComplianceReportRequest } from '@/types/hospital';
import { Shield } from 'lucide-react';

interface ComplianceReportFormProps {
  initialData?: Partial<ComplianceReportRequest>;
  onSubmit: (data: ComplianceReportRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ComplianceReportForm: React.FC<ComplianceReportFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ComplianceReportRequest>({
    hospitalId: initialData?.hospitalId || '',
    reportType: initialData?.reportType || '',
    period: initialData?.period || '',
    status: initialData?.status || 'PENDING',
    summary: initialData?.summary || '',
    preparedBy: initialData?.preparedBy || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            Report Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="reportType"
            value={formData.reportType}
            onChange={handleChange}
            required
            placeholder="REGULATORY, FINANCIAL, OPERATIONAL..."
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Period <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="period"
            value={formData.period}
            onChange={handleChange}
            required
            placeholder="Q3-2026, August-2026..."
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition bg-white"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Prepared By <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="preparedBy"
            value={formData.preparedBy}
            onChange={handleChange}
            required
            placeholder="Dr. Sarah Perera"
            className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Summary <span className="text-red-500">*</span>
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={4}
            required
            placeholder="Provide a summary of the compliance report..."
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
            <>
              <Shield className="w-4 h-4" />
              Create Report
            </>
          )}
        </button>
      </div>
    </form>
  );
};