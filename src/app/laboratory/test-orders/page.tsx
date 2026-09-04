"use client";

import { useEffect, useState } from "react";
import { createTestOrder, getAllTestOrders } from "../api/labApi";
import { LabTest, TestPriority } from "../types";

export default function TestOrdersPage() {
    const [orders, setOrders] = useState<LabTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        patientId: "",
        doctorId: "",
        hospitalId: "",
        requestedTests: "",
        priority: "ROUTINE" as TestPriority,
        homeCollectionRequested: false,
        clinicalNotes: "",
    });

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await getAllTestOrders();
            setOrders(data);
        } catch (e) {
            setMessage(e instanceof Error ? e.message : "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTestOrder({
                ...form,
                requestedTests: form.requestedTests.split(",").map((t) => t.trim()).filter(Boolean),
            });
            setMessage("Test order created successfully.");
            setForm({ ...form, patientId: "", requestedTests: "", clinicalNotes: "" });
            loadOrders();
        } catch (e) {
            setMessage(e instanceof Error ? e.message : "Failed to create order");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Test Orders</h2>

            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border mb-6 grid grid-cols-2 gap-3 max-w-2xl">
                <input
                    placeholder="Patient ID"
                    value={form.patientId}
                    onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                    className="border p-2 rounded"
                    required
                />
                <input
                    placeholder="Doctor ID"
                    value={form.doctorId}
                    onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                    className="border p-2 rounded"
                    required
                />
                <input
                    placeholder="Hospital ID"
                    value={form.hospitalId}
                    onChange={(e) => setForm({ ...form, hospitalId: e.target.value })}
                    className="border p-2 rounded"
                    required
                />
                <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as TestPriority })}
                    className="border p-2 rounded"
                >
                    <option value="ROUTINE">Routine</option>
                    <option value="URGENT">Urgent</option>
                    <option value="STAT">STAT</option>
                </select>
                <input
                    placeholder="Tests (comma separated: CBC, Lipid Profile)"
                    value={form.requestedTests}
                    onChange={(e) => setForm({ ...form, requestedTests: e.target.value })}
                    className="border p-2 rounded col-span-2"
                    required
                />
                <textarea
                    placeholder="Clinical notes"
                    value={form.clinicalNotes}
                    onChange={(e) => setForm({ ...form, clinicalNotes: e.target.value })}
                    className="border p-2 rounded col-span-2"
                />
                <label className="flex items-center gap-2 col-span-2 text-sm">
                    <input
                        type="checkbox"
                        checked={form.homeCollectionRequested}
                        onChange={(e) => setForm({ ...form, homeCollectionRequested: e.target.checked })}
                    />
                    Home sample collection requested
                </label>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded col-span-2">
                    Create Test Order
                </button>
                {message && <p className="col-span-2 text-sm text-gray-600">{message}</p>}
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="bg-white rounded-lg border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">Order No</th>
                            <th className="p-3">Patient</th>
                            <th className="p-3">Tests</th>
                            <th className="p-3">Priority</th>
                            <th className="p-3">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((o) => (
                            <tr key={o.id} className="border-t">
                                <td className="p-3">{o.testOrderNumber || o.id.slice(-6)}</td>
                                <td className="p-3">{o.patientId}</td>
                                <td className="p-3">{o.requestedTests.join(", ")}</td>
                                <td className="p-3">{o.priority}</td>
                                <td className="p-3">
                                    <span className="px-2 py-1 rounded text-xs bg-gray-100">{o.status}</span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && <p className="p-4 text-gray-500">No test orders found.</p>}
                </div>
            )}
        </div>
    );
}