// src/app/pharmacy/inventory/expiry/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, RefreshCw } from "lucide-react";
import { usePharmacyId } from "@/hooks/usePharmacyId";
import { getInventoryByPharmacy } from "@/services/pharmacyService";

type InventoryRecord = {
    id?: string;
    quantity?: number;
    stock?: number;
    expiryDate?: string;
    name?: string;
    medicineName?: string;
    batchNumber?: string;
    batchNo?: string;
    category?: string;
    unitPrice?: number;
    price?: number;
    medicine?: {
        name?: string;
        category?: string;
    };
};

interface ProcessedExpiryItem {
    id: string;
    name: string;
    batchNo: string;
    stock: number;
    expiryDate: string;
    daysLeft: number;
    status: "Critical" | "Warning" | "Good";
    category: string;
    unitPrice: number;
}

function calculateDaysLeft(dateStr?: string): number {
    if (!dateStr) return 999;
    const exp = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diffTime = exp - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getStatus(days: number): "Critical" | "Warning" | "Good" {
    if (days <= 30) return "Critical";
    if (days <= 60) return "Warning";
    return "Good";
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
        ? dateStr
        : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ExpiryManagementPage() {
    const { pharmacyId, loading: pharmacyLoading } = usePharmacyId();
    const [searchTerm, setSearchTerm] = useState("");
    const [inventoryList, setInventoryList] = useState<InventoryRecord[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            if (!pharmacyId) return;

            try {
                setIsFetching(true);
                const res = await getInventoryByPharmacy(pharmacyId);

                if (!isMounted) return;

                let data: InventoryRecord[] = [];
                if (Array.isArray(res)) {
                    data = res as unknown as InventoryRecord[];
                } else if (res && typeof res === "object" && "data" in res) {
                    data = (res as { data: unknown }).data as InventoryRecord[];
                }

                setInventoryList(data);
                if (data.length > 0 && data[0]?.id) {
                    setSelectedBatchId(data[0].id);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Failed to load inventory for expiry management:", err);
                }
            } finally {
                if (isMounted) {
                    setIsFetching(false);
                }
            }
        }

        if (!pharmacyLoading && pharmacyId) {
            void loadData();
        }

        return () => {
            isMounted = false;
        };
    }, [pharmacyId, pharmacyLoading]);

    const handleRefresh = useCallback(async () => {
        if (!pharmacyId) return;
        try {
            setIsFetching(true);
            const res = await getInventoryByPharmacy(pharmacyId);
            let data: InventoryRecord[] = [];
            if (Array.isArray(res)) {
                data = res as unknown as InventoryRecord[];
            } else if (res && typeof res === "object" && "data" in res) {
                data = (res as { data: unknown }).data as InventoryRecord[];
            }
            setInventoryList(data);
        } catch (err) {
            console.error("Failed to refresh:", err);
        } finally {
            setIsFetching(false);
        }
    }, [pharmacyId]);

    const loading = pharmacyLoading || isFetching;

    const processedData: ProcessedExpiryItem[] = useMemo(() => {
        return inventoryList.map((item) => {
            const days = calculateDaysLeft(item.expiryDate);
            const medName = item.medicineName || item.name || item.medicine?.name || "Medicine";
            const batchNumber = item.batchNumber || item.batchNo || `BATCH-${item.id?.slice(0, 5) || "001"}`;
            const stockCount = item.quantity ?? item.stock ?? 0;
            const categoryName = item.category || item.medicine?.category || "Pharmaceuticals";
            const priceVal = item.unitPrice ?? item.price ?? 0;

            return {
                id: item.id || "",
                name: medName,
                batchNo: batchNumber,
                stock: stockCount,
                expiryDate: formatDate(item.expiryDate),
                daysLeft: days,
                status: getStatus(days),
                category: categoryName,
                unitPrice: priceVal
            };
        });
    }, [inventoryList]);

    const selectedBatch = useMemo(() => {
        return processedData.find((item) => item.id === selectedBatchId) || processedData[0] || null;
    }, [processedData, selectedBatchId]);

    const kpis = useMemo(() => {
        let exp30 = 0;
        let exp60 = 0;
        let expired = 0;
        let valueAtRisk = 0;

        processedData.forEach((item) => {
            if (item.daysLeft <= 0) {
                expired += 1;
                valueAtRisk += item.stock * (item.unitPrice || 10);
            } else if (item.daysLeft <= 30) {
                exp30 += 1;
                valueAtRisk += item.stock * (item.unitPrice || 10);
            } else if (item.daysLeft <= 60) {
                exp60 += 1;
            }
        });

        return { exp30, exp60, expired, valueAtRisk };
    }, [processedData]);

    const filteredData = processedData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Expiry Management</h1>
                    <p className="text-sm text-slate-500">Monitor medicine expiry dates, batch risks, and manage disposal actions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => void handleRefresh()}
                        disabled={!pharmacyId || loading}
                        className="flex items-center gap-2 px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm text-slate-600 hover:bg-slate-50 shadow-sm disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm">
                        Review Queue
                    </button>
                </div>
            </div>

            {/* KPI Overviews */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expiring in 30 Days</span>
                    <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-slate-900">{kpis.exp30}</span>
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">Immediate Action</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expiring in 60 Days</span>
                    <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-slate-900">{kpis.exp60}</span>
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">Attention</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expired Medicines</span>
                    <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-slate-900">{kpis.expired}</span>
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700">Quarantined</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stock Value at Risk</span>
                    <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-slate-900">LKR {kpis.valueAtRisk.toLocaleString()}</span>
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">Estimated</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Table */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
                    <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <h2 className="text-base font-semibold text-slate-900">Expiry Inventory</h2>
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search batch or medicine..."
                                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                            <tr>
                                <th className="py-3 px-4">Medicine Details</th>
                                <th className="py-3 px-4">Batch No</th>
                                <th className="py-3 px-4 text-center">Stock</th>
                                <th className="py-3 px-4">Expiry Date</th>
                                <th className="py-3 px-4 text-center">Days Left</th>
                                <th className="py-3 px-4 text-center">Status</th>
                                <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-slate-400">Loading inventory data...</td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-slate-400">No inventory records found.</td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => setSelectedBatchId(item.id)}
                                        className={`hover:bg-slate-50 cursor-pointer transition ${selectedBatch?.id === item.id ? "bg-blue-50/40" : ""}`}
                                    >
                                        <td className="py-3.5 px-4 font-medium text-slate-900">
                                            {item.name}
                                            <div className="text-xs text-slate-400 font-normal">{item.category}</div>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-xs">{item.batchNo}</td>
                                        <td className="py-3.5 px-4 text-center font-medium">{item.stock}</td>
                                        <td className="py-3.5 px-4 text-xs">{item.expiryDate}</td>
                                        <td className="py-3.5 px-4 text-center">
                        <span className={`font-semibold ${item.daysLeft <= 30 ? "text-red-600" : "text-amber-600"}`}>
                          {item.daysLeft <= 0 ? "Expired" : `${item.daysLeft}d`}
                        </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === "Critical"
                                ? "bg-red-100 text-red-700"
                                : item.status === "Warning"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {item.status}
                        </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
                                                Inspect
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Info Section */}
                <div className="space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
                        <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-3">Expiry Rules & Alerts</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Early Warning</span>
                                <span className="font-medium text-slate-900">60 Days</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Critical Warning</span>
                                <span className="font-medium text-red-600">30 Days</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Dispensing Block</span>
                                <span className="font-medium text-slate-900">0 Days (Expired)</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
                        <h3 className="font-semibold text-slate-900 text-sm">Selected Batch Inspection</h3>
                        {selectedBatch ? (
                            <div className="space-y-3 text-xs">
                                <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                                    <div className="flex justify-between font-semibold text-slate-900">
                                        <span>{selectedBatch.name}</span>
                                        <span className={selectedBatch.status === "Critical" ? "text-red-600" : "text-amber-600"}>
                      {selectedBatch.status}
                    </span>
                                    </div>
                                    <p className="text-slate-500">Batch: {selectedBatch.batchNo}</p>
                                    <p className="text-slate-500">Stock: {selectedBatch.stock} units | Exp: {selectedBatch.expiryDate}</p>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button className="flex-1 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">
                                        Return to Supplier
                                    </button>
                                    <button className="flex-1 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700">
                                        Quarantine / Dispose
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400">Select an item from the list to view details.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}