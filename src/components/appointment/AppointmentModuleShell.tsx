"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface AppointmentModuleShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  action?: ReactNode;
}

const navItems = [
  { href: "/appointments", label: "My Appointments" },
  { href: "/appointments/search-doctor", label: "Find a Doctor" },
  { href: "/appointments/book", label: "Book Appointment" },
];

export default function AppointmentModuleShell({
  title,
  subtitle,
  children,
  action,
}: AppointmentModuleShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
                  Appointment Management
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              </div>
              {action}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 px-5 py-4 sm:px-6">
            {navItems.map((item) => {
              const isActive =
                item.href === "/appointments"
                  ? pathname === "/appointments" ||
                    (pathname.startsWith("/appointments/") &&
                      !pathname.startsWith("/appointments/search-doctor") &&
                      !pathname.startsWith("/appointments/book"))
                  : pathname === item.href || pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
