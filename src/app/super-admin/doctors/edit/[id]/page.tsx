"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, ArrowLeft, MapPin, Briefcase, Building2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { superAdminService } from "@/services/superadmin.service";
import toast from "react-hot-toast";

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    branchId: "",
    branchCode: "",
    accountStatus: "Active"
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await superAdminService.getDoctorById(id);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          department: data.department || "",
          branchId: data.branchId || "",
          branchCode: data.branchCode || "",
          accountStatus: data.accountStatus || "Active"
        });
      } catch (error) {
        toast.error("Failed to load doctor details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const finalData = {
        ...formData,
        branchCode: formData.branchCode || (formData.branchId ? formData.branchId.substring(0, 3).toUpperCase() : "COL")
      };
      
      await superAdminService.updateDoctor(id, finalData);
      toast.success("Doctor details updated successfully!");
      router.push("/super-admin/doctors");
    } catch (error) {
      toast.error("Failed to update doctor details");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-full min-h-[60vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#0052CC]/30 border-t-[#0052CC] animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-500">Loading doctor details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/super-admin/doctors" className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit Doctor Profile</h1>
          <p className="text-xs text-slate-500 font-medium">Update details for {formData.name || "doctor"}</p>
        </div>
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0052CC] flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="Dr. John Doe"
                  />
                </div>
              </div>

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
                    placeholder="doctor@healthbridge.com"
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0052CC] flex items-center justify-center shrink-0">
                <Briefcase size={16} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Professional Details</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Department</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-slate-400" />
                  </div>
                  <select 
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm appearance-none bg-white"
                  >
                    <option value="" disabled>Select Department</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Medical">General Medical</option>
                    <option value="Surgical">Surgical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Branch Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="text"
                    name="branchId"
                    required
                    value={formData.branchId}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all text-sm"
                    placeholder="e.g. Colombo City Hospital"
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/super-admin/doctors">
              <button 
                type="button"
                className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </Link>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#0052CC] hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-[#0052CC]/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
