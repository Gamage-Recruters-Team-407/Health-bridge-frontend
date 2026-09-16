"use client";

import { Activity, BarChart3, FileBarChart2, Landmark, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const analyticsNavigation = [
  { label: "Analytics Dashboard", href: "/analytics", icon: LayoutDashboard },
  { label: "Healthcare Analytics", href: "/analytics/healthcare", icon: Activity },
  { label: "Financial Analytics", href: "/analytics/financial", icon: Landmark },
  { label: "Operational Analytics", href: "/analytics/operational", icon: BarChart3 },
  { label: "Population Health", href: "/analytics/population-health", icon: Users },
  { label: "Reports Analytics", href: "/analytics/reports", icon: FileBarChart2 },
] as const;

export default function AnalyticsNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Analytics navigation" className="mt-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {analyticsNavigation.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`group rounded-2xl border p-4 text-left shadow-[0_6px_20px_rgba(15,23,42,0.04)] transition-all duration-200 ${isActive ? "border-blue-200 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"}`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                {isActive && <span className="rounded-full bg-blue-600/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700">Current</span>}
              </div>
              <div className="mt-4">
                <h2 className="text-sm font-semibold text-slate-900">{label}</h2>
                <p className="mt-1 text-xs text-slate-500">Open {label.toLowerCase()}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
