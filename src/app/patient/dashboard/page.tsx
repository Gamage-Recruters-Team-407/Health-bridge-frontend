"use client";

import DashboardLayout from "@/app/dashboard/layout";
import { Calendar, Clock, FileText, Heart, Pill } from "lucide-react";

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

export default function PatientDashboardPage() {
  return (
    <DashboardLayout pageTitle="Patient Dashboard">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, Patient!</h1>
        <p className="mt-1 text-blue-100">Your health is our priority. Here&apos;s your health summary.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className={`${stat.color} w-10 h-10 rounded-lg text-white flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Appointments</h2>
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div key={`${appointment.doctor}-${appointment.date}`} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Clock className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{appointment.doctor}</p>
                  <p className="text-xs text-slate-500">{appointment.date} • {appointment.time} • {appointment.type}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Confirmed</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Prescriptions</h2>
          <div className="space-y-3">
            {prescriptions.map((prescription) => (
              <div key={prescription.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Pill className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{prescription.name}</p>
                  <p className="text-xs text-slate-500">{prescription.dosage}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${prescription.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {prescription.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
