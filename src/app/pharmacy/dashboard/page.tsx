// src/app/pharmacy/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllMedicines, getLowStockAlerts } from "@/services/pharmacyService";
import type { InventoryItem } from "@/types/pharmacy";

<<<<<<< HEAD
=======
// TODO: replace with the logged-in pharmacist's actual pharmacyId (from auth/session context)
>>>>>>> 86968a85e262a531503ab17e9f003d686fa4e5e1
const CURRENT_PHARMACY_ID = "REPLACE_WITH_LOGGED_IN_PHARMACY_ID";

export default function PharmacyDashboardPage() {
    const [totalMedicines, setTotalMedicines] = useState<number | null>(null);
    const [lowStock, setLowStock] = useState<InventoryItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const [medicines, alerts] = await Promise.all([
                    getAllMedicines(),
                    getLowStockAlerts(CURRENT_PHARMACY_ID),
                ]);
                if (!cancelled) {
                    setTotalMedicines(medicines.length);
                    setLowStock(alerts);
                }
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load dashboard data");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const criticalCount = lowStock?.filter((i) => i.quantity <= 0).length ?? 0;

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
                        <span aria-hidden>←</span> Back
                    </Link>
                    <h1 className="text-lg font-semibold text-slate-900">Pharmacy Dashboard</h1>
                    <span className="text-sm text-slate-400">
            {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
            })}
          </span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                    <button aria-label="Notifications" className="rounded-full p-2 hover:bg-slate-100">🔔</button>
                    <button aria-label="Calendar" className="rounded-full p-2 hover:bg-slate-100">📅</button>
                    <div className="h-8 w-8 rounded-full bg-slate-300" aria-hidden />
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-6 p-6">
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        Couldn&apos;t load dashboard data: {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Total Medicines"
                        value={loading ? "…" : totalMedicines?.toLocaleString() ?? "—"}
                        icon="💊"
                    />
                    <StatCard
                        label="Low Stock Alerts"
                        value={loading ? "…" : String(lowStock?.length ?? 0)}
                        sub={criticalCount > 0 ? `${criticalCount} Critical` : undefined}
                        subColor="text-red-500"
                        icon="⚠️"
                    />
                    <StatCard label="Today's Orders" value="—" sub="API pending" icon="🚚" pending />
                    <StatCard label="Today's Revenue" value="—" sub="API pending" icon="💵" pending />
                </div>

                <section className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                            📣 Alerts &amp; Notifications
                        </h2>
                        <Link href="/pharmacy/inventory" className="text-sm font-medium text-blue-600 hover:underline">
                            View All Alerts →
                        </Link>
                    </div>

                    {loading ? (
                        <p className="text-sm text-slate-400">Loading alerts…</p>
                    ) : lowStock && lowStock.length > 0 ? (
                        <ul className="divide-y divide-slate-100">
                            {lowStock.slice(0, 5).map((item) => {
                                const isCritical = item.quantity <= 0;
                                return (
                                    <li key={item.id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                      <span
                          className={`rounded px-2 py-0.5 text-xs font-medium ${
                              isCritical ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                          }`}
                      >
                        {isCritical ? "CRITICAL" : "WARNING"}
                      </span>
                                            <span className="text-sm text-slate-700">
                        {item.itemName} — Stock: {item.quantity} / Threshold: {item.minimumStock}
                      </span>
                                        </div>
                                        <button className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                                            Reorder
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-400">No low-stock alerts right now.</p>
                    )}
                </section>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <section className="rounded-xl bg-white p-5 shadow-sm lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-slate-900">Pending Prescriptions</h2>
                            <span className="text-xs font-medium text-slate-400">API pending</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Connect this section once the Prescription module exposes a &quot;pending prescriptions&quot; endpoint.
                        </p>
                    </section>

                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <h2 className="mb-2 text-sm font-medium text-slate-500">Revenue Summary (Today)</h2>
                        <p className="text-sm text-slate-400">API pending — connect to Sales/Invoice service.</p>
                    </section>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <section className="rounded-xl bg-white p-5 shadow-sm lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-slate-900">Recent Orders</h2>
                            <span className="text-xs font-medium text-slate-400">API pending</span>
                        </div>
                        <p className="text-sm text-slate-400">Connect to Sales/Invoice service once available.</p>
                    </section>

                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <h2 className="mb-2 text-base font-semibold text-slate-900">Top Selling Medicines</h2>
                        <p className="text-sm text-slate-400">API pending — connect to Sales report endpoint.</p>
                    </section>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link href="/pharmacy/medicines/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        + Add Medicine
                    </Link>
                    <Link href="/pharmacy/orders/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        🛒 Create Order
                    </Link>
                    <Link href="/pharmacy/inventory" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        📋 View Inventory
                    </Link>
                </div>
            </main>
        </div>
    );
}

function StatCard({
                      label,
                      value,
                      sub,
                      subColor = "text-slate-400",
                      icon,
                      pending = false,
                  }: {
    label: string;
    value: string;
    sub?: string;
    subColor?: string;
    icon: string;
    pending?: boolean;
}) {
    return (
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="rounded-full bg-slate-100 p-1.5 text-base" aria-hidden>
          {icon}
        </span>
            </div>
            <div className={`text-2xl font-semibold ${pending ? "text-slate-300" : "text-slate-900"}`}>{value}</div>
            {sub && <div className={`mt-1 text-xs font-medium ${subColor}`}>{sub}</div>}
        </div>
    );
}