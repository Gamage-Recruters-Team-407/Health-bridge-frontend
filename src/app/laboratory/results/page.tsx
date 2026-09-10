"use client";

import { useState } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { saveResult, publishResult } from "../api/labApi";
import { ResultParameter } from "../types";
import { Plus } from "lucide-react";

export default function ResultsPage() {
    const [form, setForm] = useState({
        testOrderId: "", sampleId: "", patientId: "", verifiedBy: "", isCritical: false,
    });
    const [parameters, setParameters] = useState<ResultParameter[]>([
        { parameterName: "", value: "", unit: "", referenceRange: "", outOfRange: false },
    ]);
    const [message, setMessage] = useState("");
    const [savedResultId, setSavedResultId] = useState("");
    const inputClass = "border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

    const updateParam = (i: number, field: keyof ResultParameter, value: string | boolean) => {
        const updated = [...parameters];
        (updated[i] as any)[field] = value;
        setParameters(updated);
    };

    const addParam = () =>
        setParameters([...parameters, { parameterName: "", value: "", unit: "", referenceRange: "", outOfRange: false }]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await saveResult({ ...form, parameters, status: "DRAFT" });
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
        <DashboardLayout pageTitle="Enter Test Result">
            <h2 className="text-lg font-semibold text-slate-900">Enter Test Result</h2>
            <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl space-y-4 shadow-sm">
                <div className="grid grid-cols-3 gap-3">
                    <input placeholder="Test Order ID" value={form.testOrderId} required
                           onChange={(e) => setForm({ ...form, testOrderId: e.target.value })} className={inputClass} />
                    <input placeholder="Sample ID" value={form.sampleId} required
                           onChange={(e) => setForm({ ...form, sampleId: e.target.value })} className={inputClass} />
                    <input placeholder="Patient ID" value={form.patientId} required
                           onChange={(e) => setForm({ ...form, patientId: e.target.value })} className={inputClass} />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Parameters</h3>
                    <div className="space-y-2">
                        {parameters.map((p, i) => (
                            <div key={i} className="grid grid-cols-5 gap-2 items-center">
                                <input placeholder="Name" value={p.parameterName}
                                       onChange={(e) => updateParam(i, "parameterName", e.target.value)} className={inputClass} />
                                <input placeholder="Value" value={p.value}
                                       onChange={(e) => updateParam(i, "value", e.target.value)} className={inputClass} />
                                <input placeholder="Unit" value={p.unit}
                                       onChange={(e) => updateParam(i, "unit", e.target.value)} className={inputClass} />
                                <input placeholder="Reference Range" value={p.referenceRange}
                                       onChange={(e) => updateParam(i, "referenceRange", e.target.value)} className={inputClass} />
                                <label className="flex items-center gap-1 text-xs text-slate-500">
                                    <input type="checkbox" checked={p.outOfRange}
                                           onChange={(e) => updateParam(i, "outOfRange", e.target.checked)} />
                                    Out of range
                                </label>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addParam} className="flex items-center gap-1 text-blue-600 text-sm mt-2">
                        <Plus size={14} /> Add parameter
                    </button>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={form.isCritical}
                           onChange={(e) => setForm({ ...form, isCritical: e.target.checked })} />
                    Mark as critical result 🚨
                </label>

                <input placeholder="Verified By (Lab Officer ID)" value={form.verifiedBy} required
                       onChange={(e) => setForm({ ...form, verifiedBy: e.target.value })} className={`${inputClass} w-full`} />

                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm">
                        Save Result
                    </button>
                    {savedResultId && (
                        <button type="button" onClick={handlePublish}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm">
                            Publish Result
                        </button>
                    )}
                </div>
                {message && <p className="text-sm text-emerald-600">{message}</p>}
            </form>
        </DashboardLayout>
    );
}