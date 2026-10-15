"use client";

import React, { useState, useEffect } from "react";
import { Building2, ShieldCheck, User, ArrowLeft, Globe, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { superAdminService } from "@/services/superadmin.service";
import toast from "react-hot-toast";

export default function EditInsuranceProviderPage() {
  const router = useRouter();
  const params = useParams();
  const providerId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    licenseNo: "",
    contactName: "",
    contactRole: "",
    coverageRegions: "Global",
    status: "Approved",
  });

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const data = await superAdminService.getInsuranceProviderById(providerId);
        if (data) {
          const regions = Array.isArray(data.coverageRegions)
            ? data.coverageRegions.join(", ")
            : data.coverageRegions || "Global";

          setFormData({
            name: data.name || "",
            licenseNo: data.licenseNo || "",
            contactName: data.contactName || "",
            contactRole: data.contactRole || "",
            coverageRegions: regions,
            status: data.status || "Approved",
          });
        }
      } catch (error) {
        console.error("Failed to load provider details", error);
        toast.error("Failed to load provider details");
        router.push("/super-admin/insurance");
      } finally {
        setIsLoading(false);
      }
    };

    if (providerId) {
      fetchProvider();
    }
  }, [providerId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      await superAdminService.updateInsuranceProvider(providerId, payload);
      toast.success("Insurance provider updated successfully!");
      router.push("/super-admin/insurance");
    } catch (error) {
      console.error("Failed to update provider", error);
      toast.error("Failed to update provider");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-slate-50 items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#0052CC]/30 border-t-[#0052CC] animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-500">Loading provider details...</p>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-slate-900">Edit Insurance Provider</h1>
          <p className="text-xs text-slate-500 font-medium">
            Update licensing and operational information for {formData.name || providerId}
          </p>
        </div>
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
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
                    <Building2 size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="e.g. Ceylinco Healthcare Insurance"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">License Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="licenseNo"
                    required
                    value={formData.licenseNo}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="e.g. LCN-2026-CH01"
                  />
                </div>
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
                <label className="text-sm font-bold text-slate-700">Status</label>
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
                  <span>Updating Provider...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Update Provider</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
