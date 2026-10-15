"use client";

import React, { useState } from "react";
import { Building2, ShieldCheck, User, ArrowLeft, Globe, FileText, CheckCircle2, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { superAdminService } from "@/services/superadmin.service";
import toast from "react-hot-toast";

export default function AddInsuranceProviderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    licenseNo: "",
    contactName: "",
    contactRole: "",
    coverageRegions: "Global",
    status: "Approved",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const regionsArray = formData.coverageRegions
        ? formData.coverageRegions.split(",").map((r) => r.trim()).filter(Boolean)
        : ["Global"];

      const payload = {
        name: formData.name,
        licenseNo: formData.licenseNo,
        contactName: formData.contactName,
        contactRole: formData.contactRole,
        coverageRegions: regionsArray,
        status: formData.status,
      };

      await superAdminService.createInsuranceProvider(payload);
      toast.success("Insurance provider saved successfully!");
      router.push("/super-admin/insurance");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to save insurance provider. License number or company name may already exist.";
      setErrorMessage(msg);
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (errorMessage) setErrorMessage(null);
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">
      {/* Top Navigation Bar */}
      <div className="flex items-center gap-4 mb-2">
        <Link
          href="/super-admin/insurance"
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add New Insurance Provider</h1>
          <p className="text-xs text-slate-500 font-medium">
            Register a new insurance company and compliance profile in Health Bridge
          </p>
        </div>
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Inline Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-800">Unable to save insurance provider</p>
                <p className="text-red-600 text-xs mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Section 1: Company Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0052CC] flex items-center justify-center shrink-0">
                <Building2 size={16} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Company & License Details</h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Company Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 size={16} className={errorMessage?.toLowerCase().includes("name") ? "text-red-500" : "text-slate-400"} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all text-sm ${
                      errorMessage?.toLowerCase().includes("name")
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/20 text-red-900"
                        : "border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20"
                    }`}
                    placeholder="e.g. Ceylinco Healthcare Insurance"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">License Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={16} className={errorMessage?.toLowerCase().includes("license") ? "text-red-500" : "text-slate-400"} />
                  </div>
                  <input
                    type="text"
                    name="licenseNo"
                    required
                    value={formData.licenseNo}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all text-sm ${
                      errorMessage?.toLowerCase().includes("license")
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/20 text-red-900"
                        : "border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20"
                    }`}
                    placeholder="e.g. LCN-2026-CH01"
                  />
                </div>
                {errorMessage?.toLowerCase().includes("license") && (
                  <p className="text-xs text-red-600 font-medium mt-1">{errorMessage}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Coverage Regions</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="coverageRegions"
                    value={formData.coverageRegions}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="Comma separated: Global, North America, APAC"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Initial Status</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck size={16} className="text-slate-400" />
                  </div>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm bg-white"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Primary Contact */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0052CC] flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Primary Contact Officer</h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Contact Person Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="e.g. Amanda Perera"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Contact Role / Designation</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="contactRole"
                    value={formData.contactRole}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="e.g. Head of Compliance"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href="/super-admin/insurance"
              className="px-6 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#0052CC] hover:bg-blue-700 text-white font-bold transition-all text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Provider</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
