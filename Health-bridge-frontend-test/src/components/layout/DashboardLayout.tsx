"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "./Footer";
import { ToastProvider } from "@/components/ui/Toast";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  userRole?: string;
  userName?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  pageTitle = "Dashboard",
  userRole = "Chief Medical Officer",
  userName = "Dr. Anura Jayasinghe",
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white">
        {/* Sidebar Navigation */}
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          userRole={userRole}
          userName={userName}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Navbar
            title={pageTitle}
            onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
            userName={userName}
            userRole={userRole}
          />

          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>

          <Footer />
        </div>
      </div>
    </ToastProvider>
  );
};

export default DashboardLayout;
