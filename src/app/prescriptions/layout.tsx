"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import { useAuth } from "@/hooks/useAuth";

export default function PrescriptionsLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Dynamic title based on route
  let pageTitle = "Prescriptions";
  if (pathname.includes("/create")) pageTitle = "Create Prescription";
  else if (pathname.includes("/edit")) pageTitle = "Edit Prescription";
  else if (pathname.includes("/download")) pageTitle = "Download Prescription";
  else if (pathname.match(/\/prescriptions\/[a-f0-9-]+$/)) {
    pageTitle = "Prescription Details";
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <Sidebar 
        userRole={user?.role || "PATIENT"}
        userName={user?.fullName || "User"}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar/Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-slate-900">{pageTitle}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.fullName}</span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
              {user?.role}
            </span>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}