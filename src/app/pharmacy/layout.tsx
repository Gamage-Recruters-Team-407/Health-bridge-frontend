import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";

export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-slate-50">
            <PharmacySidebar />
            <div className="flex-1">
                <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-3">
                    <div className="flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search records, doctors..."
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-blue-400"
                        />
                    </div>
                    <button aria-label="Notifications" className="rounded-full p-2 text-slate-500 hover:bg-slate-100">🔔</button>
                    <button aria-label="Help" className="rounded-full p-2 text-slate-500 hover:bg-slate-100">❓</button>
                    <div className="h-8 w-8 rounded-full bg-slate-300" aria-hidden />
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}