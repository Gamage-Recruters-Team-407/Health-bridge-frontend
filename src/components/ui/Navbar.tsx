"use client";

import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  AlertTriangle,
  User,
  ShieldCheck,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  title?: string;
  userName?: string;
  userRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  title = "Dashboard",
  userName = "User",
  userRole = "Patient",
}) => {
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mockNotifications = [
    { id: 1, title: "Emergency Dispatch", desc: "Ambulance requested for Patient #P-8842", time: "2 mins ago", type: "urgent" },
    { id: 2, title: "Lab Results Ready", desc: "CBC report for Nimali Silva is ready", time: "15 mins ago", type: "normal" },
    { id: 3, title: "Appointment Alert", desc: "Dr. Wickramasinghe scheduled at 3:00 PM", time: "1 hour ago", type: "normal" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("healthbridge_token");
    localStorage.removeItem("healthbridge_user");
    window.location.href = "/login";
  };

  return (
    <header className="h-16 border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none md:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-[#0A2540] tracking-tight leading-snug">
            {title}
          </h1>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Active</span>
            <span>•</span>
            <span>Hospital Node #01</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients, doctors, medical records..."
            className="w-full pl-10 pr-12 py-2 text-xs rounded-xl bg-[#F8FAFC] border border-transparent focus:border-blue-500 focus:bg-white text-[#0A2540] placeholder-slate-400 transition-all outline-none"
          />
          <kbd className="absolute right-3 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white rounded border border-slate-200 pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Emergency Button */}
        <button
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-semibold transition-all shadow-sm"
        >
          <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
          <span>Emergency</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#0A2540]">Notifications</h3>
                  <Badge variant="primary" size="sm">{unreadNotifications} Unread</Badge>
                </div>
                <button
                  onClick={() => setUnreadNotifications(0)}
                  className="text-[11px] font-medium text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-blue-50/50 transition-colors flex gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      n.type === "urgent" ? "bg-red-500" : "bg-blue-500"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0A2540]">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-slate-100 text-center bg-[#F8FAFC]">
                <a href="/notifications" className="text-xs font-medium text-blue-600 hover:underline">
                  View all notifications →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-[#0A2540] leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-blue-600 font-medium">
                {userRole}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 p-1.5">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-[#0A2540]">{userName}</p>
                <p className="text-[11px] text-slate-500">{userRole}</p>
              </div>

              <a
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                Profile & Account
              </a>
              <a
                href="/settings"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                Settings
              </a>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;