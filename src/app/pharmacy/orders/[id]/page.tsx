"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDeliveryById, updateDeliveryStatus } from "@/services/pharmacyService";
import type { Delivery } from "@/types/pharmacy";

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [order, setOrder] = useState<Delivery | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const data = await getDeliveryById(id);
                if (!cancelled) setOrder(data);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load order");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        if (id) {
            void load();
        }
        return () => {
            cancelled = true;
        };
    }, [id]);

    async function handleStatusChange(newStatus: string) {
        if (!order) return;
        try {
            setUpdating(true);
            const updated = await updateDeliveryStatus(order.id, newStatus);
            setOrder(updated);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to update status");
        } finally {
            setUpdating(false);
        }
    }

    if (loading) return <p className="text-sm text-slate-400">Loading order…</p>;

    if (error || !order) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Couldn&apos;t load order: {error ?? "Not found"}
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <button onClick={() => router.back()} className="mb-1 text-sm text-slate-500 hover:text-slate-700">
                        ← Back to orders
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold text-slate-900">Order #{order.orderCode}</h1>
                        {order.actionRequired && (
                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                ⚠ Action Required
              </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-400">Delivery code: {order.deliveryCode}</p>
                </div>
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                    Print Label
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* A. Verification — API pending */}
                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-slate-900">A. Verification</h2>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">STEP 1</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Patient details (DOB, gender) and prescribing doctor info (name, NPI) — API pending, connect to
                            Prescription module once available.
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                            Patient ID: <span className="font-medium text-slate-600">{order.patientId}</span>
                        </p>
                    </section>

                    {/* B. Fulfillment */}
                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-slate-900">B. Fulfillment</h2>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">STEP 2</span>
                        </div>

                        {order.items.length === 0 ? (
                            <p className="text-sm text-slate-400">No items on this order.</p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {order.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{item.medicineName}</p>
                                            <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400">
                      Batch/Expiry — API pending
                    </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <p className="mt-2 text-xs text-slate-400">
                            Batch/expiry selection and barcode scanning aren&apos;t wired yet — connect to Inventory batch lookup.
                        </p>
                    </section>

                    {/* Delivery Details — real data */}
                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <h2 className="mb-3 text-base font-semibold text-slate-900">🚚 Delivery Details</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-slate-400">Shipping Address</p>
                                <p className="text-sm font-medium text-slate-900">{order.deliveryAddress}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Fulfillment Type</p>
                                <p className="text-sm font-medium text-slate-900">{order.fulfillmentType ?? "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Courier Assignment</p>
                                <p className="text-sm font-medium text-slate-900">{order.courierService ?? "Not assigned"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Assigned Rider</p>
                                <p className="text-sm font-medium text-slate-900">{order.assignedRiderName ?? "Not assigned"}</p>
                            </div>
                        </div>
                    </section>

                    {/* Billing Summary — API pending */}
                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-slate-900">Billing Summary</h2>
                            <span className="text-xs font-medium text-slate-400">API pending</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Subtotal, insurance coverage, delivery fee, and patient copay — connect to Sales/Invoice service once
                            available.
                        </p>
                    </section>
                </div>

                {/* Status sidebar */}
                <div className="space-y-4">
                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-slate-900">Order Status</h2>
                        <p className="mb-4 rounded-full bg-blue-50 px-3 py-1.5 text-center text-sm font-medium text-blue-700">
                            {order.status}
                        </p>
                        <div className="space-y-2">
                            {["PROCESSING", "DISPATCHED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map((status) => (
                                <button
                                    key={status}
                                    disabled={updating || order.status === status}
                                    onClick={() => handleStatusChange(status)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Mark as {status.replace(/_/g, " ").toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}