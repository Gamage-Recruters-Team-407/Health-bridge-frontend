"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { getToken, getStoredUser, AuthUser } from "@/lib/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function DashboardLayout({
  children,
  pageTitle = "Dashboard",
}: DashboardLayoutProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user] = useState<AuthUser | null>(() => {
    const token = getToken();
    return token ? getStoredUser() : null;
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router, user]);

  if (!user) {
    return null;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          userRole={user.role}
          userName={user.fullName}
        />

        <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50">
          <Navbar
            title={pageTitle}
            onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
            userName={user.fullName}
            userRole={user.role}
          />

          <main className="flex-1 px-4 md:px-6 py-4 w-full space-y-6">
            {children}
          </main>

          <Footer />
        </div>
      </div>
    </ToastProvider>
  );
}