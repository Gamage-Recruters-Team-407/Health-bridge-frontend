"use client";

import { useEffect, useMemo, useState } from "react";
import { getInventoryByPharmacy, getLowStockAlerts } from "@/services/pharmacyService";
import { usePharmacyId } from "@/hooks/usePharmacyId";
import type { InventoryItem } from "@/types/pharmacy";

export default function LowStockAlertsPage() {
    const { pharmacyId } = usePharmacyId();
    const [allInventory, setAllInventory] = useState<InventoryItem[]>([]);
    const [lowStock, setLowStock] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        if (!pharmacyId) return;
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const [all, alerts] = await Promise.all([
                    getInventoryByPharmacy(pharmacyId!),
                    getLowStockAlerts(pharmacyId!),
                ]);
                if (!cancelled) {
                    setAllInventory(all);
                    setLowStock(alerts);
                }
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load low stock alerts");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [pharmacyId]);

    const stats = useMemo(() => {
        const critical = lowStock.filter((i) => i.status === "LOW_STOCK" && i.quantity > 0).length;
        const outOfStock = allInventory.filter((i) => i.status === "OUT_OF_STOCK").length;
        const healthy = allInventory.length - lowStock.length - outOfStock;
        return {
            lowStock: lowStock.length,
            critical,
            outOfStock,
            healthy: Math.max(healthy, 0),
        };
    }, [allInventory, lowStock]);

    const categories = useMemo(
        () => Array.from(new Set(allInventory.map((i) => i.category).filter(Boolean))) as string[],
        [allInventory]
    );

    const filtered = useMemo(() => {
        return lowStock.filter((item) => {
            const matchesSearch =
                !search ||
                item.itemName.toLowerCase().includes(search.toLowerCase()) ||
                item.itemCode.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
            const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [lowStock, search, categoryFilter, statusFilter]);

    return (
        <div>
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Low Stock Alerts</h1>
                    <p className="text-sm text-slate-500">
                        Monitor medicines running low and take timely action to maintain sufficient pharmacy inventory.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                        ↻ Refresh Stock
                    </button>
                    <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                        ⬇ Export Report
                    </button>
                    <button
                        disabled
                        className="cursor-not-allowed rounded-lg bg-blue-300 px-4 py-2 text-sm font-medium text-white"
                        title="Bulk reorder isn't wired to a Procurement service yet"
                    >
                        Reorder Medicines
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Couldn&apos;t load low stock data: {error}
                </div>
            )}

            {!loading && (stats.critical > 0 || stats.outOfStock > 0) && (
                <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
                    <div>
                        <p className="text-sm font-semibold text-red-700">
                            {stats.critical + stats.outOfStock} medicines require immediate attention
                        </p>
                        <p className="text-xs text-red-500">
                            {stats.critical} medicines are critically low and {stats.outOfStock} medicines are currently out of stock.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                            View Critical Items
                        </button>
                        <button className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                            Reorder Now
                        </button>
                    </div>
                </div>
            )}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard label="Low Stock" value={loading ? "…" : stats.lowStock} sub="Below minimum stock level" tone="amber" icon="📦" />
                <StatCard label="Critical Stock" value={loading ? "…" : stats.critical} sub="Immediate restocking required" tone="red" icon="❗" />
                <StatCard label="Out of Stock" value={loading ? "…" : stats.outOfStock} sub="No units available" tone="dark" icon="🚫" />
                <StatCard label="Reorder Pending" value="—" sub="API pending" icon="🚚" pending />
                <StatCard label="Stock Healthy" value={loading ? "…" : stats.healthy} sub="Medicines adequately stocked" tone="green" icon="✅" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <section className="rounded-xl bg-white p-5 shadow-sm lg:col-span-2">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search low stock items..."
                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                        >
                            <option value="ALL">All statuses</option>
                            <option value="LOW_STOCK">Low stock</option>
                            <option value="OUT_OF_STOCK">Out of stock</option>
                        </select>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                        >
                            <option value="ALL">All categories</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-slate-100">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                            <tr>
                                <th className="px-4 py-2 font-medium">Medicine / ID</th>
                                <th className="px-4 py-2 font-medium">Category</th>
                                <th className="px-4 py-2 font-medium">Current Stock</th>
                                <th className="px-4 py-2 font-medium">Status</th>
                                <th className="px-4 py-2 font-medium">Recommended Order</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Loading…</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No low-stock items match your filters.</td></tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-2">
                                            <p className="font-medium text-slate-900">{item.itemName}</p>
                                            <p className="text-xs text-slate-400">{item.itemCode}</p>
                                        </td>
                                        <td className="px-4 py-2 text-slate-600">{item.category ?? "—"}</td>
                                        <td className="px-4 py-2">
                                            <p className="text-slate-600">{item.quantity} / {item.minimumStock} Min</p>
                                            <div className="mt-1 h-1.5 w-24 rounded-full bg-slate-100">
                                                <div
                                                    className={`h-1.5 rounded-full ${item.quantity <= 0 ? "bg-red-500" : "bg-amber-500"}`}
                                                    style={{ width: `${Math.min(100, (item.quantity / Math.max(item.minimumStock, 1)) * 100)}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="px-4 py-2 text-slate-400">API pending</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="space-y-4">
                    <section className="rounded-xl bg-blue-600 p-5 text-white shadow-sm">
                        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">✨ AI Stock Forecast</h2>
                        <p className="text-xs text-blue-100">
                            AI-based demand forecasting isn&apos;t wired to a backend service yet — this would need a
                            forecasting/ML endpoint before it can show real predictions.
                        </p>
                    </section>

                    <section className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-1 text-sm font-semibold text-slate-900">🛡 Critical Alerts</h2>
                        <p className="mb-3 text-xs text-slate-400">Life-saving drugs below safe thresholds</p>
                        <p className="text-sm text-slate-400">
                            API pending — needs a way to flag specific medicines as &quot;life-saving/critical&quot; in the
                            Medicine catalog.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

function StatCard({
                      label,
                      value,
                      sub,
                      icon,
                      tone = "slate",
                      pending = false,
                  }: {
    label: string;
    value: string | number;
    sub?: string;
    icon: string;
    tone?: "slate" | "amber" | "red" | "dark" | "green";
    pending?: boolean;
}) {
    const toneMap: Record<string, string> = {
        slate: "text-slate-900",
        amber: "text-amber-600",
        red: "text-red-600",
        dark: "text-slate-900",
        green: "text-green-600",
    };
    const bgMap: Record<string, string> = {
        dark: "bg-slate-900 text-white",
    };
    return (
        <div className={`rounded-xl p-5 shadow-sm ${bgMap[tone] ?? "bg-white"}`}>
            <div className="mb-2 flex items-center justify-between">
                <span className={`text-xs font-medium uppercase ${tone === "dark" ? "text-slate-300" : "text-slate-400"}`}>{label}</span>
                <span aria-hidden>{icon}</span>
            </div>
            <div className={`text-2xl font-semibold ${pending ? "text-slate-300" : tone === "dark" ? "text-white" : toneMap[tone]}`}>
                {value}
            </div>
            {sub && <div className={`mt-1 text-xs ${tone === "dark" ? "text-slate-400" : "text-slate-400"}`}>{sub}</div>}
        </div>
    );
}

function StatusBadge({ status }: { status: InventoryItem["status"] }) {
    const styles: Record<InventoryItem["status"], string> = {
        IN_STOCK: "bg-green-50 text-green-700",
        LOW_STOCK: "bg-amber-50 text-amber-700",
        OUT_OF_STOCK: "bg-red-50 text-red-700",
        EXPIRED: "bg-slate-100 text-slate-500",
    };
    const labels: Record<InventoryItem["status"], string> = {
        IN_STOCK: "In stock",
        LOW_STOCK: "Low stock",
        OUT_OF_STOCK: "Out of stock",
        EXPIRED: "Expired",
    };
    return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
}