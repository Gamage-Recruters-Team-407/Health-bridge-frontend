"use client";

import DashboardLayout from "@/app/dashboard/layout";

export default function ReportsPage() {
    const reportTypes = [
        "Laboratory Test Result Report", "Test Request Report", "Sample Tracking Report",
        "Diagnostic Summary Report", "Laboratory Performance Report", "Test Turnaround Time Report",
    ];

    return (
        <DashboardLayout pageTitle="Laboratory Reports">
            <h2 className="text-lg font-semibold text-slate-900">Laboratory Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((r) => (
                    <div key={r} className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
                        <span className="text-sm font-medium text-slate-700">{r}</span>
                        <div className="flex gap-2">
                            <button className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg">PDF</button>
                            <button className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg">Excel</button>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}