"use client";

import { useState } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/ui/Navbar";

export default function DoctorShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
      <div className="flex min-h-screen bg-[#f4f7f9] text-slate-900">
        <Sidebar userRole="DOCTOR" userName="Dr. Maya Perera" mobileOpen={open} onCloseMobile={() => setOpen(false)} />
        <div className="min-w-0 flex-1">
          <Navbar
            onToggleMobileSidebar={() => setOpen(true)}
            title="Doctor Dashboard"
            userName="Dr. Maya Perera"
            userRole="DOCTOR"
            fixed
          />
          <main className="mx-auto max-w-[1440px] p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-20">{children}</main>
        </div>
      </div>
  );
}
