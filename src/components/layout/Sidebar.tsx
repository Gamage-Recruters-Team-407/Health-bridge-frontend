"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, User, Calendar, FileText, Pill, Activity, MonitorPlay, Shield, Phone, Settings, LogOut } from "lucide-react";
import HeaderLogo from "@/components/HeaderLogo";
import { getStoredUser, clearAuthData, AuthUser } from "@/lib/auth";

export const PATIENT_LINKS = [
  { name: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { name: "Doctor", href: "/patient/doctors", icon: User },
  { name: "Appointments", href: "/patient/appointments", icon: Calendar },
  { name: "Medical Records", href: "/patient/medical-records", icon: FileText },
  { name: "Prescriptions", href: "/patient/prescriptions", icon: Pill },
  { name: "Lab Reports", href: "/patient/laboratory", icon: Activity },
  { name: "Telemedicine", href: "/patient/telemedicine", icon: MonitorPlay },
  { name: "Insurance", href: "/patient/insurance", icon: Shield },
  { name: "SOS", href: "/patient/emergency", icon: Phone },
];

export const DOCTOR_LINKS = [
  // Other developers will add Doctor specific routes here later
  { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    clearAuthData();
    router.push("/login");
  };

  // Determine which links to show based on role
  const activeLinks = user?.role === "DOCTOR" ? DOCTOR_LINKS : PATIENT_LINKS;
  
  // Dynamically determines if it should be /patient/settings or /doctor/settings
  const rolePrefix = user?.role?.toLowerCase().replace("_", "-") || "patient";

  return (
    <aside className="w-[260px] h-screen bg-[#F8F9FB] border-r border-[#C3C6D6] flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="px-8 py-6">
        <HeaderLogo />
      </div>
      <nav className="flex-1 px-4 py-2 space-y-1">
        {activeLinks.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href);
          return (
            <Link key={link.name} href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive 
                  ? "bg-blue-50/50 border-r-4 border-[#003D9B] text-[#003D9B] font-semibold" 
                  : "text-[#434654] font-medium hover:bg-slate-100"
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#C3C6D7] space-y-1">
        <Link href={`/${rolePrefix}/settings`} className="flex items-center gap-3 px-4 py-2 text-[#434654] font-medium hover:bg-slate-100 rounded-lg">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-[#434654] font-medium hover:bg-slate-100 rounded-lg cursor-pointer transition">
          <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
          <span className="text-sm group-hover:text-red-600">Logout</span>
        </button>
      </div>
    </aside>
  );
}
