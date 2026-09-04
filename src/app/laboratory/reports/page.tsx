export default function ReportsPage() {
    const reportTypes = [
        "Laboratory Test Result Report",
        "Test Request Report",
        "Sample Tracking Report",
        "Diagnostic Summary Report",
        "Laboratory Performance Report",
        "Test Turnaround Time Report",
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Laboratory Reports</h2>
            <div className="grid grid-cols-2 gap-4">
                {reportTypes.map((r) => (
                    <div key={r} className="bg-white border rounded-lg p-4 flex justify-between items-center">
                        <span className="text-sm font-medium">{r}</span>
                        <div className="flex gap-2">
                            <button className="text-xs bg-gray-100 px-3 py-1 rounded">PDF</button>
                            <button className="text-xs bg-gray-100 px-3 py-1 rounded">Excel</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}