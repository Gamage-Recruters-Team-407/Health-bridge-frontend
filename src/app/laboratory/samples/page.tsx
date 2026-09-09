"use client";

import { useState } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { collectSample, receiveSampleByBarcode } from "../api/labApi";

export default function SamplesPage() {
    const [form, setForm] = useState({
        testOrderId: "", barcodeId: "", sampleType: "Blood", collectedBy: "", collectionLocation: "Lab",
    });
    const [message, setMessage] = useState("");
    const inputClass = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

    const handleCollect = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await collectSample(form);
            setMessage(`Sample ${form.barcodeId} marked as collected.`);
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Failed to collect sample");
        }
    };

    const handleReceive = async () => {
        if (!form.barcodeId) return setMessage("Enter a barcode ID first.");
        try {
            await receiveSampleByBarcode(form.barcodeId);
            setMessage(`Sample ${form.barcodeId} received at lab.`);
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Failed to receive sample");
        }
    };

    return (
        <DashboardLayout pageTitle="Sample Collection">
            <h2 className="text-lg font-semibold text-slate-900">Sample Collection</h2>
            <form onSubmit={handleCollect} className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg space-y-3 shadow-sm">
                <input placeholder="Test Order ID" value={form.testOrderId} required
                       onChange={(e) => setForm({ ...form, testOrderId: e.target.value })} className={inputClass} />
                <input placeholder="Barcode ID (scan)" value={form.barcodeId} required
                       onChange={(e) => setForm({ ...form, barcodeId: e.target.value })} className={inputClass} />
                <select value={form.sampleType}
                        onChange={(e) => setForm({ ...form, sampleType: e.target.value })} className={inputClass}>
                    <option>Blood</option><option>Urine</option><option>Swab</option>
                </select>
                <input placeholder="Collected By (Lab Officer ID)" value={form.collectedBy} required
                       onChange={(e) => setForm({ ...form, collectedBy: e.target.value })} className={inputClass} />
                <select value={form.collectionLocation}
                        onChange={(e) => setForm({ ...form, collectionLocation: e.target.value })} className={inputClass}>
                    <option>Lab</option><option>Home</option>
                </select>
                <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm">
                        Mark Collected
                    </button>
                    <button type="button" onClick={handleReceive}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm">
                        Receive at Lab
                    </button>
                </div>
                {message && <p className="text-sm text-emerald-600">{message}</p>}
            </form>
        </DashboardLayout>
    );
}