"use client";

import React, { useState } from "react";
import { Building2, Mail, Phone, MapPin, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { superAdminService } from "@/services/superadmin.service";
import toast from "react-hot-toast";

export default function AddBranchPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    branchName: "",
    email: "",
    phone: "",
    city: "",
    branchCode: `BR-${Math.floor(Math.random() * 9000) + 1000}`,
    status: "PENDING"
  });

  const branchOptions = ["Colombo", "Gampaha", "Kalutara", "Kegalle", "Ratnapura"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    
    try {
      await superAdminService.createBranch(formData);
      toast.success("Branch created successfully!");
      router.push("/super-admin/branches");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to create branch. Branch code or name may already exist.";
      setErrorMessage(msg);
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (errorMessage) setErrorMessage(null);
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/super-admin/branches" className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#0A2540]">Add New Branch</h1>
          <p className="text-xs text-slate-500 font-medium">Register a new hospital branch</p>
        </div>
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Inline Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-800">Unable to create branch</p>
                <p className="text-red-600 text-xs mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0052CC] flex items-center justify-center shrink-0">
                <Building2 size={16} />
              </div>
              <h2 className="text-lg font-bold text-[#0A2540]">Branch Information</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Branch Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="text"
                    name="branchName"
                    required
                    value={formData.branchName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="e.g. Colombo General"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Auto-generated Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="text"
                    name="branchCode"
                    disabled
                    value={formData.branchCode}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none text-sm"
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone size={16} />
              </div>
              <h2 className="text-lg font-bold text-[#0A2540]">Contact Details</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="contact@branch.lk"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="+94 77 123 4567"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">Select Branch City</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-slate-400" />
                  </div>
                  <select
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm appearance-none bg-white cursor-pointer"
                  >
                    <option value="" disabled>Select Branch</option>
                    {branchOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-2.5 rounded-xl font-bold text-white transition-all shadow-sm ${
                isSubmitting 
                  ? "bg-slate-400 cursor-not-allowed" 
                  : "bg-[#0052CC] hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? "Registering..." : "Register Branch"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
