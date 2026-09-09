"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { Calendar, FileText, Pill, Heart, Clock, Bell, HeadphonesIcon } from "lucide-react";
import Link from "next/link";
import { getStoredUser, AuthUser } from "@/lib/auth";

export default function PatientDashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    }
  }, []);

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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.fullName || "Patient"}! 🏥
          </h1>
          <p className="mt-1 text-blue-100">Your health is our priority. Here&apos;s your health summary.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/notifications/patient"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-sm transition"
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </Link>
          <Link
            href="/support/patient"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-blue-600 hover:bg-blue-50 text-xs font-semibold shadow-sm transition"
          >
            <HeadphonesIcon className="w-4 h-4" />
            <span>Support</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
            <div className="flex items-center justify-between">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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