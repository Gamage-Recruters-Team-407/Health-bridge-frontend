// import { getAllTestOrders } from "../api/labApi";
// import { LabTest } from "../types";
//
// export default async function DashboardPage() {
//     let orders: LabTest[] = [];
//     let error: string | null = null;
//
//     try {
//         orders = await getAllTestOrders();
//     } catch (e) {
//         error = e instanceof Error ? e.message : "Failed to load dashboard data";
//     }
//
//     const counts = {
//         requested: orders.filter((o) => o.status === "REQUESTED").length,
//         sampleCollected: orders.filter((o) => o.status === "SAMPLE_COLLECTED").length,
//         processing: orders.filter((o) => o.status === "PROCESSING").length,
//         completed: orders.filter((o) => o.status === "COMPLETED").length,
//     };
//
//     const stats = [
//         { label: "Requested", value: counts.requested, color: "bg-yellow-100 text-yellow-800" },
//         { label: "Sample Collected", value: counts.sampleCollected, color: "bg-blue-100 text-blue-800" },
//         { label: "Processing", value: counts.processing, color: "bg-purple-100 text-purple-800" },
//         { label: "Completed", value: counts.completed, color: "bg-green-100 text-green-800" },
//     ];
//
//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-bold mb-6">Laboratory Dashboard</h2>
//
//             {error && (
//                 <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
//                     Could not connect to backend: {error}
//                 </div>
//             )}
//
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {stats.map((s) => (
//                     <div key={s.label} className={`p-5 rounded-lg ${s.color}`}>
//                         <p className="text-sm font-medium">{s.label}</p>
//                         <p className="text-3xl font-bold mt-1">{s.value}</p>
//                     </div>
//                 ))}
//             </div>
//
//             <div className="mt-8">
//                 <h3 className="font-semibold mb-3">Recent Test Orders</h3>
//                 <div className="bg-white rounded-lg border divide-y">
//                     {orders.slice(0, 8).map((o) => (
//                         <div key={o.id} className="p-3 flex justify-between text-sm">
//                             <span>{o.patientId} — {o.requestedTests.join(", ")}</span>
//                             <span className="font-medium">{o.status}</span>
//                         </div>
//                     ))}
//                     {orders.length === 0 && !error && (
//                         <p className="p-3 text-gray-500 text-sm">No test orders yet.</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import { getAllTestOrders } from "../api/labApi";
import { LabTest } from "../types";

export default function DashboardPage() {
    const [orders, setOrders] = useState<LabTest[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllTestOrders()
            .then(setOrders)
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
            .finally(() => setLoading(false));
    }, []);

    const counts = {
        requested: orders.filter((o) => o.status === "REQUESTED").length,
        sampleCollected: orders.filter((o) => o.status === "SAMPLE_COLLECTED").length,
        processing: orders.filter((o) => o.status === "PROCESSING").length,
        completed: orders.filter((o) => o.status === "COMPLETED").length,
    };

    const stats = [
        { label: "Requested", value: counts.requested, color: "bg-yellow-100 text-yellow-800" },
        { label: "Sample Collected", value: counts.sampleCollected, color: "bg-blue-100 text-blue-800" },
        { label: "Processing", value: counts.processing, color: "bg-purple-100 text-purple-800" },
        { label: "Completed", value: counts.completed, color: "bg-green-100 text-green-800" },
    ];

    if (loading) return <p className="p-6">Loading dashboard...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Laboratory Dashboard</h2>

            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
                    Could not connect to backend: {error}
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className={`p-5 rounded-lg ${s.color}`}>
                        <p className="text-sm font-medium">{s.label}</p>
                        <p className="text-3xl font-bold mt-1">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h3 className="font-semibold mb-3 text-gray-900">Recent Test Orders</h3>
                <div className="bg-white rounded-lg border divide-y">
                    {orders.slice(0, 8).map((o) => (
                        <div key={o.id} className="p-3 flex justify-between text-sm text-gray-800">
                            <span>{o.patientId} — {o.requestedTests.join(", ")}</span>
                            <span className="font-medium">{o.status}</span>
                        </div>
                    ))}
                    {orders.length === 0 && !error && (
                        <p className="p-3 text-gray-500 text-sm">No test orders yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}