// src/app/pharmacy/layout.tsx
"use client";

import React, { useState } from "react";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import { Search, Bell, HelpCircle } from "lucide-react";

export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
    const [headerSearch, setHeaderSearch] = useState("");

    return (
        <div className="flex min-h-screen bg-slate-50">
            <PharmacySidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white px-6 py-3 shadow-sm">
                    {/* Global Search Input Box with Text Clipping Fix */}
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            value={headerSearch}
                            onChange={(e) => setHeaderSearch(e.target.value)}
                            placeholder="Search records, doctors, prescriptions..."
                            className="w-full pl-10 pr-9 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 bg-slate-50/80 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition"
                        />
                        {headerSearch && (
                            <button
                                type="button"
                                onClick={() => setHeaderSearch("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Action Icons & Profile */}
                    <div className="flex items-center gap-3 ml-4">
                        <button
                            type="button"
                            aria-label="Notifications"
                            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                        >
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
                        </button>

                        <button
                            type="button"
                            aria-label="Help"
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                        >
                            <HelpCircle className="w-4 h-4" />
                        </button>

                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs flex items-center justify-center shadow-sm">
                            PH
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}