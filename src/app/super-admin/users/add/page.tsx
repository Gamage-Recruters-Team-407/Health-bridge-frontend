"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Lock, UserPlus, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { superAdminService } from "@/services/superadmin.service";
import toast from "react-hot-toast";

export default function AddUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "PATIENT",
    password: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password || formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const computedFullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      await superAdminService.createUser({
        ...formData,
        fullName: computedFullName || formData.firstName.trim(),
        confirmPassword
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("User created successfully!");
      setTimeout(() => {
        router.push("/super-admin/users");
      }, 1500);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to create user. Email may already exist.";
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">User Added Successfully</h2>
        <p className="text-slate-500 text-lg">Redirecting back to user list...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/super-admin/users" className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add User</h1>
          <p className="text-sm text-slate-500 font-medium">Create a new user account in the HealthBridge system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        
        {/* User Details Section */}
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            User Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-sm"
                  placeholder="e.g. Kasuni"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Last Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-sm"
                  placeholder="e.g. Gamage"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="pl-12 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="e.g. user@healthbridge.lk" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="pl-12 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">System Role <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                </div>
                <select required name="role" value={formData.role} onChange={handleChange} className="pl-12 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white appearance-none">
                  <option value="" disabled>Select a role...</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="PATIENT">Patient</option>
                  <option value="PHARMACIST">Pharmacist</option>
                  <option value="LAB_OFFICER">Lab Technician</option>
                  <option value="INSURANCE_OFFICER">Insurance Officer</option>
                  <option value="ADMIN">Hospital Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Account Security Section */}
        <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Account Security
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Set the initial password for this user. They can change it later.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  required 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8} 
                  className="pl-12 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white" 
                  placeholder="Minimum 8 characters" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  required 
                  type="password" 
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8} 
                  className="pl-12 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white" 
                  placeholder="Retype password" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 sm:p-8 bg-white flex items-center justify-end gap-4">
          <Link href="/super-admin/users" className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#0052CC] hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding User...
              </>
            ) : (
              "Create User"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
