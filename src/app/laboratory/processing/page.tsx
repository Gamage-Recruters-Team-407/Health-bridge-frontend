// import { getTestOrdersByStatus } from "../api/labApi";
// import { LabTest } from "../types";
//
// export default async function ProcessingPage() {
//     let orders: LabTest[] = [];
//     let error: string | null = null;
//
//     try {
//         orders = await getTestOrdersByStatus("SAMPLE_COLLECTED");
//     } catch (e) {
//         error = e instanceof Error ? e.message : "Failed to load processing queue";
//     }
//
//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Processing Queue</h2>
//             {error && <p className="text-red-600">{error}</p>}
//             <div className="bg-white rounded-lg border divide-y">
//                 {orders.map((o) => (
//                     <div key={o.id} className="p-3 flex justify-between text-sm">
//                         <span>{o.patientId} — {o.requestedTests.join(", ")}</span>
//                         <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
//               Awaiting processing
//             </span>
//                     </div>
//                 ))}
//                 {orders.length === 0 && !error && (
//                     <p className="p-3 text-gray-500 text-sm">No samples waiting for processing.</p>
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import { getTestOrdersByStatus } from "../api/labApi";
import { LabTest } from "../types";

export default function ProcessingPage() {
    const [orders, setOrders] = useState<LabTest[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTestOrdersByStatus("SAMPLE_COLLECTED")
            .then(setOrders)
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Processing Queue</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <div className="bg-white rounded-lg border divide-y">
                {orders.map((o) => (
                    <div key={o.id} className="p-3 flex justify-between text-sm text-gray-800">
                        <span>{o.patientId} — {o.requestedTests.join(", ")}</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
              Awaiting processing
            </span>
                    </div>
                ))}
                {orders.length === 0 && !error && (
                    <p className="p-3 text-gray-500 text-sm">No samples waiting for processing.</p>
                )}
            </div>
        </div>
    );
}