"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getToken, getStoredUser } from "@/lib/auth";
import DashboardLayout from "@/app/dashboard/layout";
import {
  Users,
  Hospital,
  Calendar,
  DollarSign,
  Pill,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Settings,
  UserCheck,
  ClipboardCheck,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const isMounted = useRef(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    console.log('🔍 Admin Dashboard - Checking auth...');

    const token = getToken();
    const user = getStoredUser();

    console.log('📋 Token:', token ? '✅ Found' : '❌ Not found');
    console.log('📋 User:', user ? '✅ Found' : '❌ Not found');

    if (!token || !user) {
      console.log('🔀 Redirecting to login...');
      router.replace("/login");
      return;
    }

    console.log('✅ User authenticated:', user.fullName);

    if (isMounted.current) {
      setIsAuthenticated(true);
      setUserName(user.fullName);
      setLoading(false);
    }

    return () => {
      isMounted.current = false;
    };
  }, [router]);

  // ✅ Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-slate-700">Loading Dashboard...</p>
          <p className="mt-2 text-sm text-slate-400">Please wait while we prepare your workspace</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // ✅ Dashboard Content
  const stats = [
    { label: "Total Users", value: "1,284", icon: Users, color: "bg-blue-500" },
    { label: "Total Hospitals", value: "48", icon: Hospital, color: "bg-green-500" },
    { label: "Total Doctors", value: "342", icon: UserCheck, color: "bg-purple-500" },
    { label: "Total Patients", value: "8,921", icon: Users, color: "bg-pink-500" },
    { label: "Revenue", value: "$124,892", icon: DollarSign, color: "bg-yellow-500" },
    { label: "Appointments", value: "1,823", icon: Calendar, color: "bg-indigo-500" },
  ];

  const quickActions = [
    { label: "Billing", icon: DollarSign, href: "/hospital/billing", color: "bg-emerald-500" },
    { label: "Inventory", icon: Pill, href: "/hospital/inventory", color: "bg-blue-500" },
    { label: "Compliance", icon: ClipboardCheck, href: "/hospital/billing/compliance", color: "bg-purple-500" },
    { label: "Users", icon: Users, href: "/admin/users", color: "bg-pink-500" },
    { label: "Analytics", icon: TrendingUp, href: "/analytics", color: "bg-orange-500" },
    { label: "Settings", icon: Settings, href: "/admin/settings", color: "bg-slate-500" },
  ];

  const recentActivities = [
    { id: 1, user: "John Doe", action: "registered as a new patient", time: "2 mins ago", type: "success" },
    { id: 2, user: "Dr. Smith", action: "completed consultation for Patient #8842", time: "15 mins ago", type: "info" },
    { id: 3, user: "System", action: "Low stock alert for Paracetamol 500mg", time: "1 hour ago", type: "warning" },
    { id: 4, user: "Jane Doe", action: "paid invoice #INV-202609010001", time: "3 hours ago", type: "success" },
    { id: 5, user: "Dr. Kumar", action: "requested lab test for Patient #7721", time: "5 hours ago", type: "info" },
  ];

  return (
    <DashboardLayout pageTitle="Dashboard">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Welcome back, {userName}! 👋</h1>
        <p className="mt-1 text-blue-100">Here&apos;s what&apos;s happening with your healthcare platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition hover:border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-2.5 rounded-lg text-white shadow-sm`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="bg-white rounded-xl shadow-sm p-4 border border-slate-200 hover:shadow-md hover:border-blue-300 transition text-center group"
            >
              <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition text-white shadow-sm`}>
                <action.icon className="w-6 h-6" />
              </div>
              <p className="mt-2 text-sm font-medium text-slate-700">{action.label}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                {activity.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                {activity.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {activity.type === "info" && <Activity className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-800">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-slate-500">{activity.time}</p>
              </div>
              <span className="text-xs text-slate-400">#{String(activity.id).padStart(4, '0')}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}