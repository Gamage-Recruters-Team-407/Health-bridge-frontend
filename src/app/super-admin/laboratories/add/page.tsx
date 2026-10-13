"use client";

import React, { useState } from "react";
import { Building2, Mail, Phone, FileText, ArrowLeft, MapPin, Briefcase, User, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { superAdminService } from "@/services/superadmin.service";
import toast from "react-hot-toast";

export default function AddLaboratoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    license: "",
    address: "",
    category: "General",
    owner: "",
    yearsInOperation: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await superAdminService.createLaboratory(formData);
      toast.success("Laboratory created successfully!");
      router.push("/super-admin/laboratories");
    } catch (error) {
      toast.error("Failed to create laboratory");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/super-admin/laboratories" className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add New Laboratory</h1>
          <p className="text-xs text-slate-500 font-medium">Register a new laboratory in Health Bridge</p>
        </div>
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0052CC] flex items-center justify-center shrink-0">
                <Building2 size={16} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Laboratory Information</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Laboratory Name</label>
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
                    placeholder="e.g. GreenLine Diagnostics"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">License Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="text"
                    name="license"
                    required
                    value={formData.license}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="e.g. LAB-WP-2291"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Owner Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="text"
                    name="owner"
                    required
                    value={formData.owner}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="e.g. S. Perera"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase size={16} className="text-slate-400" />
                  </div>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm appearance-none bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Clinical Pathology">Clinical Pathology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Diagnostics">Diagnostics</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone size={16} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Contact Details</h2>
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
                    placeholder="contact@lab.lk"
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
                <label className="text-sm font-bold text-slate-700">Registered Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="Enter full registered address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Years in Operation</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="text"
                    name="yearsInOperation"
                    value={formData.yearsInOperation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="e.g. 5 Years"
                  />
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
              {isSubmitting ? "Saving..." : "Save Laboratory"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
