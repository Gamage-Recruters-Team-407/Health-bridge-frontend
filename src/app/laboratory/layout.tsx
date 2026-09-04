import Link from "next/link";

export default function LabLayout({ children }: { children: React.ReactNode }) {
    const navItems = [
        { href: "/laboratory/dashboard", label: "Dashboard" },
        { href: "/laboratory/test-orders", label: "Test Orders" },
        { href: "/laboratory/samples", label: "Samples" },
        { href: "/laboratory/processing", label: "Processing" },
        { href: "/laboratory/results", label: "Results" },
        { href: "/laboratory/reports", label: "Reports" },
    ];

    return (
        <div className="flex min-h-screen">
            <aside className="w-56 border-r border-gray-200 p-4">
                <h1 className="font-bold text-lg mb-6">Laboratory Module</h1>
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700 hover:text-blue-600"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 bg-gray-50">{children}</main>
        </div>
    );
}