"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getStoredUser, AuthUser } from "@/lib/auth";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <DashboardLayout userName={user?.fullName || "Patient"} userRole={user?.role || "PATIENT"} pageTitle="Patient Dashboard">
      {children}
    </DashboardLayout>
  );
}
