"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, HelpCircle } from "lucide-react";
import { getStoredUser, AuthUser } from "@/lib/auth";

export default function Navbar() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <header className="h-[64px] bg-white border-b border-slate-100 flex items-center justify-end px-6 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <button className="text-slate-500 hover:text-slate-700 transition">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-slate-500 hover:text-slate-700 transition">
          <HelpCircle className="w-5 h-5" />
        </button>
        
        {/* User Profile Section */}
        <Link href="/patient/profile" className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 -mr-1.5 rounded-xl transition">
          <div className="w-10 h-10 rounded-full shadow-sm overflow-hidden bg-slate-600 flex items-center justify-center text-white font-medium text-lg border-2 border-slate-100">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex flex-col leading-tight pr-1">
            <span className="text-[15px] font-semibold text-[#0052CC]">
              {user?.fullName || "Loading..."}
            </span>
            <span className="text-xs font-medium text-slate-500 capitalize">
              {user?.role?.toLowerCase() || "Role"}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
