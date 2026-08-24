/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Check, CircleDollarSign, Clock3, LayoutDashboard, Menu, Stethoscope, UserRound, X, PlaneTakeoff, Bell, Search } from "lucide-react";

const navigation = [
  { href: "/doctor/dashboard", label: "Dashboard", description: "Overview and quick actions", keywords: "home appointments availability stats", icon: LayoutDashboard },
  { href: "/doctor/profile", label: "My profile", description: "Personal and professional details", keywords: "edit doctor information fee qualifications", icon: UserRound },
  { href: "/doctor/doctors", label: "Doctor directory", description: "Find doctors and specialists", keywords: "search specialist directory cards", icon: Stethoscope },
  { href: "/doctor/schedule", label: "Schedule", description: "Manage weekly availability", keywords: "calendar time slots hours available", icon: CalendarDays },
  { href: "/doctor/leave", label: "Leave", description: "Apply and track leave", keywords: "time off annual sick emergency history", icon: PlaneTakeoff },
  { href: "/doctor/earnings", label: "Earnings", description: "Revenue and payment history", keywords: "income money payments chart consultation", icon: CircleDollarSign },
];

const initialNotifications = [
  { id: "notification-1", title: "New consultation booked", detail: "Nadeesha Dissanayake · Today at 2:30 PM", time: "8 min ago", href: "/doctor/schedule", read: false },
  { id: "notification-2", title: "Leave request updated", detail: "Your annual leave request was approved", time: "1 hr ago", href: "/doctor/leave", read: false },
  { id: "notification-3", title: "Payment received", detail: "LKR 6,500 consultation payment settled", time: "Yesterday", href: "/doctor/earnings", read: true },
];

export default function DoctorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return navigation;
    return navigation.filter((item) => `${item.label} ${item.description} ${item.keywords}`.toLowerCase().includes(query));
  }, [search]);

  useEffect(() => {
    function closeSearch(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) setSearchOpen(false);
      if (!notificationsRef.current?.contains(event.target as Node)) setNotificationsOpen(false);
    }
    document.addEventListener("mousedown", closeSearch);
    return () => document.removeEventListener("mousedown", closeSearch);
  }, []);

  function openResult(href: string) {
    setSearch("");
    setSearchOpen(false);
    router.push(href);
  }

  function openNotification(id: string, href: string) {
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item));
    setNotificationsOpen(false);
    router.push(href);
  }

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="min-h-screen bg-[#f4f7f9] text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Link href="/doctor/dashboard" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white"><Stethoscope className="h-5 w-5" /></span>
            <span><strong className="block text-base">HealthBridge</strong><span className="block text-xs text-slate-500">Doctor workspace</span></span>
          </Link>
          <button aria-label="Close navigation" className="lg:hidden" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="space-y-1 p-4" aria-label="Doctor navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${active ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}><Icon className="h-[18px] w-[18px]" />{label}</Link>;
          })}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 border-t border-slate-100 pt-5">
          <div className="flex items-center gap-3 px-2">
            <img src="https://i.pravatar.cc/96?img=47" alt="Dr. Maya Perera" className="h-10 w-10 rounded-full object-cover" />
            <div className="min-w-0"><p className="truncate text-sm font-semibold">Dr. Maya Perera</p><p className="truncate text-xs text-slate-500">Cardiologist</p></div>
          </div>
        </div>
      </aside>
      {open && <button aria-label="Close navigation overlay" className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button aria-label="Open navigation" onClick={() => setOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 lg:hidden"><Menu className="h-5 w-5" /></button>
            <div ref={searchRef} className="relative">
              <label className="flex h-11 w-44 items-center gap-2 rounded-md bg-slate-100 px-3 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 sm:w-64">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && results[0]) { event.preventDefault(); openResult(results[0].href); }
                    if (event.key === "Escape") { setSearchOpen(false); event.currentTarget.blur(); }
                  }}
                  placeholder="Search workspace"
                  aria-label="Search doctor workspace"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={searchOpen}
                  aria-controls="doctor-workspace-results"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </label>
              {searchOpen && (
                <div id="doctor-workspace-results" className="absolute left-0 top-13 z-50 w-72 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-xl sm:w-80">
                  {results.length ? results.map(({ href, label, description, icon: Icon }) => (
                    <button key={href} type="button" onClick={() => openResult(href)} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-teal-50 focus:bg-teal-50 focus:outline-none">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600"><Icon className="h-4 w-4" /></span>
                      <span className="min-w-0"><span className="block text-sm font-semibold text-slate-800">{label}</span><span className="block truncate text-xs text-slate-500">{description}</span></span>
                    </button>
                  )) : <p className="px-4 py-5 text-center text-sm text-slate-500">No workspace pages found.</p>}
                  <p className="border-t border-slate-100 px-3 py-2 text-[11px] text-slate-400">Press Enter to open the first result</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div ref={notificationsRef} className="relative">
              <button
                type="button"
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                aria-expanded={notificationsOpen}
                aria-controls="doctor-notifications"
                onClick={() => { setNotificationsOpen((value) => !value); setSearchOpen(false); }}
                onKeyDown={(event) => { if (event.key === "Escape") setNotificationsOpen(false); }}
                className="relative flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">{unreadCount}</span>}
              </button>
              {notificationsOpen && (
                <div id="doctor-notifications" className="absolute right-0 top-13 z-50 w-[calc(100vw-2rem)] max-w-96 overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div><h2 className="text-sm font-bold">Notifications</h2><p className="text-xs text-slate-500">{unreadCount ? `${unreadCount} unread updates` : "You are all caught up"}</p></div>
                    {unreadCount > 0 && <button type="button" onClick={() => setNotifications((items) => items.map((item) => ({ ...item, read: true })))} className="text-xs font-semibold text-teal-700 hover:text-teal-800">Mark all read</button>}
                  </div>
                  <div className="divide-y divide-slate-100">
                    {notifications.map((notification) => (
                      <button key={notification.id} type="button" onClick={() => openNotification(notification.id, notification.href)} className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${notification.read ? "bg-white" : "bg-teal-50/60"}`}>
                        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${notification.read ? "bg-slate-100 text-slate-500" : "bg-teal-100 text-teal-700"}`}>{notification.read ? <Check className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}</span>
                        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-800">{notification.title}</span><span className="mt-0.5 block text-xs leading-5 text-slate-500">{notification.detail}</span><span className="mt-1 block text-[11px] text-slate-400">{notification.time}</span></span>
                        {!notification.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden text-right sm:block"><p className="text-sm font-semibold">Dr. Maya Perera</p><p className="text-xs text-emerald-600">Available today</p></div>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
