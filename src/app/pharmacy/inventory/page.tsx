"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getInventoryByPharmacy } from "@/services/pharmacyService";
import { usePharmacyId } from "@/hooks/usePharmacyId";
import type { InventoryItem } from "@/types/pharmacy";

export default function MedicineInventoryPage() {
    const { pharmacyId } = usePharmacyId();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    useEffect(() => {
        if (!pharmacyId) return;
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const data = await getInventoryByPharmacy(pharmacyId!);
                if (!cancelled) setInventory(data);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load inventory");
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
        const now = new Date();
        const in30Days = new Date();
        in30Days.setDate(now.getDate() + 30);

        const lowStock = inventory.filter((i) => i.quantity <= i.minimumStock).length;
        const expiringSoon = inventory.filter((i) => {
            if (!i.expiryDate) return false;
            const exp = new Date(i.expiryDate);
            return exp >= now && exp <= in30Days;
        }).length;

        return { totalSkus: inventory.length, lowStock, expiringSoon };
    }, [inventory]);

    const filtered = useMemo(() => {
        return inventory.filter((item) => {
            const matchesSearch =
                !search ||
                item.itemName.toLowerCase().includes(search.toLowerCase()) ||
                item.itemCode.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [inventory, search, statusFilter]);

    return (
        <div>
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Medicine Inventory</h1>
                    <p className="text-sm text-slate-500">Stock, dispensing, procurement, and safety management in one place.</p>
                </div>
                <Link href="/pharmacy/medicines/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    + Add Medicine
                </Link>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Couldn&apos;t load inventory: {error}
                </div>
            )}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total SKUs" value={loading ? "…" : stats.totalSkus} sub="Across all categories" icon="📦" />
                <StatCard label="Low Stock" value={loading ? "…" : stats.lowStock} sub="Needs reorder soon" icon="⚠️" tone="amber" />
                <StatCard label="Expiring in 30 Days" value={loading ? "…" : stats.expiringSoon} sub="Rotate or return" icon="⏳" tone="red" />
            </div>

            <section className="rounded-xl bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search medicines, SKU..."
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                    >
                        <option value="ALL">All statuses</option>
                        <option value="IN_STOCK">In stock</option>
                        <option value="LOW_STOCK">Low stock</option>
                        <option value="OUT_OF_STOCK">Out of stock</option>
                        <option value="EXPIRED">Expired</option>
                    </select>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-100">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                            <th className="px-4 py-2 font-medium">Medicine</th>
                            <th className="px-4 py-2 font-medium">Category</th>
                            <th className="px-4 py-2 font-medium">Stock</th>
                            <th className="px-4 py-2 font-medium">Batch</th>
                            <th className="px-4 py-2 font-medium">Expiry</th>
                            <th className="px-4 py-2 font-medium">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">Loading inventory…</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">No matching items.</td></tr>
                        ) : (
                            filtered.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-2 font-medium text-slate-900">{item.itemName}</td>
                                    <td className="px-4 py-2 text-slate-600">{item.category ?? "—"}</td>
                                    <td className="px-4 py-2 text-slate-600">{item.quantity}</td>
                                    <td className="px-4 py-2 text-slate-600">{item.batchNumber}</td>
                                    <td className="px-4 py-2 text-slate-600">
                                        {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                                    </td>
                                    <td className="px-4 py-2">
                                        <StatusBadge status={item.status} />
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

function StatCard({ label, value, sub, icon, tone = "slate" }: { label: string; value: string | number; sub?: string; icon: string; tone?: "slate" | "amber" | "red" }) {
    const color = tone === "amber" ? "text-amber-500" : tone === "red" ? "text-red-500" : "text-slate-900";
    return (
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="rounded-full bg-slate-100 p-1.5 text-base" aria-hidden>{icon}</span>
            </div>
            <div className={`text-2xl font-semibold ${color}`}>{value}</div>
            {sub && <div className="mt-1 text-xs text-slate-400">{sub}</div>}
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