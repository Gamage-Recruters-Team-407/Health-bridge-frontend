"use client";

import { useState } from "react";
import { collectSample, receiveSampleByBarcode } from "../api/labApi";

export default function SamplesPage() {
    const [form, setForm] = useState({
        testOrderId: "",
        barcodeId: "",
        sampleType: "Blood",
        collectedBy: "",
        collectionLocation: "Lab",
    });
    const [message, setMessage] = useState("");

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
        if (!form.barcodeId) {
            setMessage("Enter a barcode ID first.");
            return;
        }
        try {
            await receiveSampleByBarcode(form.barcodeId);
            setMessage(`Sample ${form.barcodeId} received at lab.`);
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Failed to receive sample");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sample Collection</h2>
            <form onSubmit={handleCollect} className="bg-white p-4 rounded-lg border max-w-md space-y-3">
                <input
                    placeholder="Test Order ID"
                    value={form.testOrderId}
                    onChange={(e) => setForm({ ...form, testOrderId: e.target.value })}
                    className="border p-2 w-full rounded"
                    required
                />
                <input
                    placeholder="Barcode ID (scan)"
                    value={form.barcodeId}
                    onChange={(e) => setForm({ ...form, barcodeId: e.target.value })}
                    className="border p-2 w-full rounded"
                    required
                />
                <select
                    value={form.sampleType}
                    onChange={(e) => setForm({ ...form, sampleType: e.target.value })}
                    className="border p-2 w-full rounded"
                >
                    <option>Blood</option>
                    <option>Urine</option>
                    <option>Swab</option>
                </select>
                <input
                    placeholder="Collected By (Lab Technician ID)"
                    value={form.collectedBy}
                    onChange={(e) => setForm({ ...form, collectedBy: e.target.value })}
                    className="border p-2 w-full rounded"
                    required
                />
                <select
                    value={form.collectionLocation}
                    onChange={(e) => setForm({ ...form, collectionLocation: e.target.value })}
                    className="border p-2 w-full rounded"
                >
                    <option>Lab</option>
                    <option>Home</option>
                </select>
                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex-1">
                        Mark Collected
                    </button>
                    <button type="button" onClick={handleReceive} className="bg-green-600 text-white px-4 py-2 rounded flex-1">
                        Receive at Lab
                    </button>
                </div>
                {message && <p className="text-sm text-gray-600">{message}</p>}
            </form>
        </div>
    );
}