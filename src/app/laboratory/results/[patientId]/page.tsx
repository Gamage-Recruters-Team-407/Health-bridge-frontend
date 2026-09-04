// import { getPatientHistory } from "../../api/labApi";
// import { LabResult } from "../../types";
//
// export default async function PatientHistoryPage({
//                                                      params,
//                                                  }: {
//     params: { patientId: string };
// }) {
//     const { patientId } = params;
//     let history: LabResult[] = [];
//     let error: string | null = null;
//
//     try {
//         history = await getPatientHistory(patientId);
//     } catch (e) {
//         error = e instanceof Error ? e.message : "Failed to load history";
//     }
//
//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Result History — {patientId}</h2>
//             {error && <p className="text-red-600">{error}</p>}
//
//             {history.map((r) => (
//                 <div
//                     key={r.id}
//                     className={`bg-white border p-4 mb-3 rounded-lg ${r.critical ? "border-red-500 bg-red-50" : ""}`}
//                 >
//                     <div className="flex justify-between mb-2">
//                         <p className="font-semibold text-sm">{new Date(r.resultedAt).toLocaleString()}</p>
//                         <div className="flex gap-2">
//                             {r.critical && <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">CRITICAL</span>}
//                             <span className="text-xs bg-gray-100 px-2 py-1 rounded">{r.status}</span>
//                         </div>
//                     </div>
//                     {r.parameters.map((p, i) => (
//                         <p key={i} className="text-sm">
//                             {p.parameterName}: <span className="font-medium">{p.value} {p.unit}</span>{" "}
//                             <span className="text-gray-400">({p.referenceRange})</span>{" "}
//                             {p.outOfRange && <span className="text-red-600 font-medium">Out of range</span>}
//                         </p>
//                     ))}
//                 </div>
//             ))}
//
//             {history.length === 0 && !error && (
//                 <p className="text-gray-500">No results found for this patient.</p>
//             )}
//         </div>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPatientHistory } from "../../api/labApi";
import { LabResult } from "../../types";

export default function PatientHistoryPage() {
    const params = useParams<{ patientId: string }>();
    const patientId = params.patientId;

    const [history, setHistory] = useState<LabResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!patientId) return;
        getPatientHistory(patientId)
            .then(setHistory)
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load history"))
            .finally(() => setLoading(false));
    }, [patientId]);

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Result History — {patientId}</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {history.map((r) => (
                <div
                    key={r.id}
                    className={`bg-white border p-4 mb-3 rounded-lg ${r.critical ? "border-red-500 bg-red-50" : ""}`}
                >
                    <div className="flex justify-between mb-2">
                        <p className="font-semibold text-sm text-gray-900">{new Date(r.resultedAt).toLocaleString()}</p>
                        <div className="flex gap-2">
                            {r.critical && <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">CRITICAL</span>}
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{r.status}</span>
                        </div>
                    </div>
                    {r.parameters.map((p, i) => (
                        <p key={i} className="text-sm text-gray-800">
                            {p.parameterName}: <span className="font-medium">{p.value} {p.unit}</span>{" "}
                            <span className="text-gray-400">({p.referenceRange})</span>{" "}
                            {p.outOfRange && <span className="text-red-600 font-medium">Out of range</span>}
                        </p>
                    ))}
                </div>
            ))}

            {history.length === 0 && !error && (
                <p className="text-gray-500">No results found for this patient.</p>
            )}
        </div>
    );
}