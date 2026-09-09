"use client";

import React from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { Calendar, Users, Clock, FileText, TrendingUp } from "lucide-react";

export default function DoctorDashboardPage() {
  const stats = [
    { label: "Today's Appointments", value: "8", icon: Calendar, color: "bg-blue-500" },
    { label: "Total Patients", value: "1,247", icon: Users, color: "bg-green-500" },
    { label: "Pending Prescriptions", value: "12", icon: FileText, color: "bg-purple-500" },
    { label: "This Month Earnings", value: "$4,892", icon: TrendingUp, color: "bg-yellow-500" },
  ];

  return (
    <DashboardLayout pageTitle="Doctor Dashboard">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, Doctor! 👨‍⚕️</h1>
        <p className="mt-1 text-emerald-100">You have 8 appointments scheduled for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-2.5 rounded-lg text-white`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Today&apos;s Schedule</h2>
        <div className="space-y-3">
          {[
            { time: "09:00 AM", patient: "John Doe", type: "Checkup" },
            { time: "10:30 AM", patient: "Jane Smith", type: "Follow-up" },
            { time: "11:45 AM", patient: "Robert Johnson", type: "Consultation" },
            { time: "02:00 PM", patient: "Mary Wilson", type: "Checkup" },
          ].map((appt, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div className="w-12 text-sm font-semibold text-blue-600 dark:text-blue-400">{appt.time}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{appt.patient}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{appt.type}</p>
              </div>
              <button className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 transition">
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}