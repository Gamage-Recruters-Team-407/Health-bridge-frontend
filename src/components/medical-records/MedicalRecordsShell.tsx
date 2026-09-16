"use client";

import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "@/app/dashboard/layout";
import DoctorShell from "@/features/doctor/components/DoctorShell";

import {
  getStoredUser,
  type AuthUser,
} from "@/lib/auth";


interface MedicalRecordsShellProps {
  children: React.ReactNode;
  pageTitle?: string;
}


export default function MedicalRecordsShell({
  children,
  pageTitle = "Medical Records",
}: MedicalRecordsShellProps) {

  /*
   * undefined = auth user has not been read yet
   * null      = no stored user
   */
  const [
    user,
    setUser,
  ] =
    useState<
      AuthUser
      | null
      | undefined
    >(
      undefined
    );


  useEffect(
    () => {
      setUser(
        getStoredUser()
      );
    },
    []
  );


  /*
   * Prevent the generic dashboard from flashing
   * before we know whether this is a doctor.
   */
  if (
    user === undefined
  ) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-50
        "
      >
        <div
          className="
            text-center
          "
        >
          <div
            className="
              mx-auto
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
              border-slate-200
              border-t-teal-600
            "
          />

          <p
            className="
              mt-3
              text-sm
              text-slate-500
            "
          >
            Loading Medical Records...
          </p>
        </div>
      </div>
    );
  }


  /*
   * =========================================================
   * DOCTOR
   * =========================================================
   *
   * Keep the SAME doctor workspace/sidebar/header used by:
   *
   * /doctor/dashboard
   * /doctor/profile
   * /doctor/schedule
   * etc.
   */
  if (
    user?.role === "DOCTOR"
  ) {
    return (
      <DoctorShell>
        {children}
      </DoctorShell>
    );
  }


  /*
   * =========================================================
   * PATIENT / ADMIN / SUPER ADMIN
   * =========================================================
   *
   * Continue using the existing role-aware shared dashboard.
   */
  return (
    <DashboardLayout
      pageTitle={pageTitle}
    >
      {children}
    </DashboardLayout>
  );
}