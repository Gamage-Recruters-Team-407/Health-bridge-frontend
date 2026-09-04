"use client";

import { useState } from "react";
import { saveResult, publishResult } from "../api/labApi";
import { ResultParameter } from "../types";

export default function ResultsPage() {
    const [form, setForm] = useState({
        testOrderId: "",
        sampleId: "",
        patientId: "",
        verifiedBy: "",
        isCritical: false,
    });
    const [parameters, setParameters] = useState<ResultParameter[]>([
        { parameterName: "", value: "", unit: "", referenceRange: "", outOfRange: false },
    ]);
    const [message, setMessage] = useState("");
    const [savedResultId, setSavedResultId] = useState("");

    const updateParam = (index: number, field: keyof ResultParameter, value: string | boolean) => {
        const updated = [...parameters];
        (updated[index] as any)[field] = value;
        setParameters(updated);
    };

    const addParam = () =>
        setParameters([...parameters, { parameterName: "", value: "", unit: "", referenceRange: "", outOfRange: false }]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await saveResult({
                ...form,
                parameters,
                status: "DRAFT",
            });
            setSavedResultId(result.id);
            setMessage("Result saved. You can now publish it.");
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Failed to save result");
        }
    };

    const handlePublish = async () => {
        try {
            await publishResult(savedResultId);
            setMessage("Result published to patient.");
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Failed to publish result");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Enter Test Result</h2>
            <form onSubmit={handleSave} className="bg-white p-4 rounded-lg border max-w-2xl space-y-3">
                <div className="grid grid-cols-3 gap-3">
                    <input placeholder="Test Order ID" value={form.testOrderId}
                           onChange={(e) => setForm({ ...form, testOrderId: e.target.value })}
                           className="border p-2 rounded" required />
                    <input placeholder="Sample ID" value={form.sampleId}
                           onChange={(e) => setForm({ ...form, sampleId: e.target.value })}
                           className="border p-2 rounded" required />
                    <input placeholder="Patient ID" value={form.patientId}
                           onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                           className="border p-2 rounded" required />
                </div>

                <h3 className="font-medium mt-4">Parameters</h3>
                {parameters.map((p, i) => (
                    <div key={i} className="grid grid-cols-5 gap-2 items-center">
                        <input placeholder="Name" value={p.parameterName}
                               onChange={(e) => updateParam(i, "parameterName", e.target.value)}
                               className="border p-2 rounded" />
                        <input placeholder="Value" value={p.value}
                               onChange={(e) => updateParam(i, "value", e.target.value)}
                               className="border p-2 rounded" />
                        <input placeholder="Unit" value={p.unit}
                               onChange={(e) => updateParam(i, "unit", e.target.value)}
                               className="border p-2 rounded" />
                        <input placeholder="Reference Range" value={p.referenceRange}
                               onChange={(e) => updateParam(i, "referenceRange", e.target.value)}
                               className="border p-2 rounded" />
                        <label className="flex items-center gap-1 text-xs">
                            <input type="checkbox" checked={p.outOfRange}
                                   onChange={(e) => updateParam(i, "outOfRange", e.target.checked)} />
                            Out of range
                        </label>
                    </div>
                ))}
                <button type="button" onClick={addParam} className="text-blue-600 text-sm">
                    + Add parameter
                </button>

                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.isCritical}
                           onChange={(e) => setForm({ ...form, isCritical: e.target.checked })} />
                    Mark as critical result 🚨
                </label>

                <input placeholder="Verified By (Lab Technician ID)" value={form.verifiedBy}
                       onChange={(e) => setForm({ ...form, verifiedBy: e.target.value })}
                       className="border p-2 rounded w-full" required />

                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Save Result
                    </button>
                    {savedResultId && (
                        <button type="button" onClick={handlePublish} className="bg-green-600 text-white px-4 py-2 rounded">
                            Publish Result
                        </button>
                    )}
                </div>
                {message && <p className="text-sm text-gray-600">{message}</p>}
            </form>
        </div>
    );
}