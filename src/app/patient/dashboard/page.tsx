"use client";

import React from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { Calendar, FileText, Pill, Heart, Clock, User, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, User as UserIcon, LogOut, HeartPulse, Bell } from "lucide-react";
import HeaderLogo from "@/components/HeaderLogo";
import AuthFooter from "@/components/AuthFooter";
import { getStoredUser, clearAuthData, AuthUser } from "@/lib/auth";
import Link from "next/link";

export default function PatientDashboardPage() {
  const stats = [
    { label: "Upcoming Appointments", value: "3", icon: Calendar, color: "bg-blue-500" },
    { label: "Medical Records", value: "12", icon: FileText, color: "bg-green-500" },
    { label: "Active Prescriptions", value: "4", icon: Pill, color: "bg-purple-500" },
    { label: "Health Score", value: "87%", icon: Heart, color: "bg-pink-500" },
  ];

  const appointments = [
    { doctor: "Dr. Anura Jayasinghe", date: "Sep 15, 2026", time: "10:30 AM", type: "Checkup" },
    { doctor: "Dr. Kamal Perera", date: "Sep 18, 2026", time: "02:00 PM", type: "Follow-up" },
    { doctor: "Dr. Lakshmi Fernando", date: "Sep 22, 2026", time: "09:00 AM", type: "Consultation" },
  ];

  const prescriptions = [
    { name: "Paracetamol 500mg", dosage: "2 tablets • 3 times daily", status: "Active" },
    { name: "Amoxicillin 500mg", dosage: "1 capsule • 2 times daily", status: "Active" },
    { name: "Metformin 850mg", dosage: "1 tablet • 2 times daily", status: "Completed" },
  ];

  return (
    <DashboardLayout pageTitle="Patient Dashboard">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, Patient! 🏥</h1>
        <p className="mt-1 text-blue-100">Your health is our priority. Here&apos;s your health summary.</p>
      </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs text-blue-700 font-medium">
              <UserIcon className="w-3.5 h-3.5" />
              <span>{user?.fullName || "User"}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                {user?.role || "PATIENT"}
              </span>
            </div>
            <Link
  href="/support/patient"
  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
>
  Support
</Link>

<Link
  href="/notifications/patient"
  className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
>
  <Bell className="h-5 w-5" />
  
</Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>






        
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 sm:p-10 flex flex-col justify-center">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-12">
          {/* Welcome Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                <HeartPulse className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-2.5 rounded-lg text-white`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Appointments</h2>
          <div className="space-y-3">
            {appointments.map((appt, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Clock className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{appt.doctor}</p>
                  <p className="text-xs text-slate-500">{appt.date} • {appt.time} • {appt.type}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Confirmed</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prescriptions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Prescriptions</h2>
          <div className="space-y-3">
            {prescriptions.map((rx, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Pill className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{rx.name}</p>
                  <p className="text-xs text-slate-500">{rx.dosage}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  rx.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {rx.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}