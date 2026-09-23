"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getDeliveriesByPharmacy } from "@/services/pharmacyService";
import type { Delivery } from "@/types/pharmacy";

const CURRENT_PHARMACY_ID = "REPLACE_WITH_LOGGED_IN_PHARMACY_ID";

const STATUS_STYLES: Record<string, string> = {
    PENDING: "bg-slate-100 text-slate-600",
    PROCESSING: "bg-amber-50 text-amber-700",
    DISPATCHED: "bg-blue-50 text-blue-700",
    OUT_FOR_DELIVERY: "bg-blue-50 text-blue-700",
    DELIVERED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-600",
    FAILED: "bg-red-50 text-red-600",
};

type TabFilter = "ALL" | "PENDING_VERIFICATION" | "IN_PREPARATION";

export default function OrdersOverviewPage() {
    const [orders, setOrders] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState<TabFilter>("ALL");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const data = await getDeliveriesByPharmacy(CURRENT_PHARMACY_ID);
                if (!cancelled) setOrders(data);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load orders");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(() => {
        return orders.filter((o) => {
            const matchesSearch =
                !search ||
                o.orderCode.toLowerCase().includes(search.toLowerCase()) ||
                o.patientId.toLowerCase().includes(search.toLowerCase());

            const matchesTab =
                tab === "ALL" ||
                (tab === "PENDING_VERIFICATION" && o.status === "PENDING") ||
                (tab === "IN_PREPARATION" && o.status === "PROCESSING");

            return matchesSearch && matchesTab;
        });
    }, [orders, search, tab]);

    return (
        <div>
            <h1 className="mb-1 text-2xl font-semibold text-slate-900">Orders Overview</h1>
            <p className="mb-6 text-sm text-slate-500">Manage and track daily prescription fulfillments.</p>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Couldn&apos;t load orders: {error}
                </div>
            )}

            {/* Stat card */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="mb-1 text-sm text-slate-500">Total Orders Today</p>
                    <p className="text-2xl font-semibold text-slate-900">{loading ? "…" : orders.length}</p>
                </div>
                <div className="rounded-xl bg-white p-5 shadow-sm opacity-50">
                    <p className="mb-1 text-sm text-slate-500">Action Required</p>
                    <p className="text-2xl font-semibold text-slate-300">
                        {loading ? "…" : orders.filter((o) => o.actionRequired).length}
                    </p>
                </div>
            </div>

            {/* Tabs + search */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-sm">
                    {[
                        { key: "ALL", label: "All Orders" },
                        { key: "PENDING_VERIFICATION", label: "Pending Verification" },
                        { key: "IN_PREPARATION", label: "In Preparation" },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key as TabFilter)}
                            className={`rounded-md px-3 py-1.5 font-medium transition ${
                                tab === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Order ID or Patient ID"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 sm:w-64"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                        <th className="px-5 py-3 font-medium">Order ID</th>
                        <th className="px-5 py-3 font-medium">Patient ID</th>
                        <th className="px-5 py-3 font-medium">Fulfillment</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="px-5 py-8 text-center text-slate-400">Loading orders…</td>
                        </tr>
                    ) : filtered.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-5 py-8 text-center text-slate-400">No orders found.</td>
                        </tr>
                    ) : (
                        filtered.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50">
                                <td className="px-5 py-3 font-medium text-slate-900">#{order.orderCode}</td>
                                <td className="px-5 py-3 text-slate-600">{order.patientId}</td>
                                <td className="px-5 py-3 text-slate-600">{order.fulfillmentType ?? "—"}</td>
                                <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[order.status] ?? "bg-slate-100 text-slate-500"}`}>
                      {order.status}
                    </span>
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <Link
                                        href={`/pharmacy/orders/${order.id}`}
                                        className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}