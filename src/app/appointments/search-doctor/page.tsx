"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { CalendarDays, Clock3, Hospital, Stethoscope, Users } from "lucide-react";
import AppointmentModuleShell from "@/components/appointment/AppointmentModuleShell";
import { appointmentService } from "@/services/appointmentService";
import type { DoctorSession, SessionSearchFilters, SessionStatus } from "@/types/appointment";

const statusText: Record<SessionStatus, string> = { AVAILABLE: "Available", FULL: "Slot full for this session", HOLIDAY: "Holiday", CANCELLED: "Cancelled", COMPLETED: "Completed" };
const statusTone: Record<SessionStatus, string> = { AVAILABLE: "bg-emerald-50 text-emerald-700", FULL: "bg-amber-50 text-amber-700", HOLIDAY: "bg-violet-50 text-violet-700", CANCELLED: "bg-rose-50 text-rose-700", COMPLETED: "bg-slate-100 text-slate-600" };
const today = new Date().toISOString().slice(0, 10);

export default function SearchDoctorPage() {
  const [form, setForm] = useState<SessionSearchFilters>({});
  const [sessions, setSessions] = useState<DoctorSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (filters: SessionSearchFilters = {}) => {
    try { setLoading(true); setError(""); setSessions(await appointmentService.searchSessions(filters)); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to load sessions."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  const submit = (event: FormEvent) => { event.preventDefault(); void load(form); };
  const clear = () => { setForm({}); void load(); };

  return <AppointmentModuleShell title="Find a Doctor Session" subtitle="Search HealthBridge Hospital sessions by doctor, specialty, or date.">
    <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2"><span className="text-sm font-medium text-slate-700">Doctor</span><input value={form.doctorId ?? ""} onChange={e=>setForm({...form,doctorId:e.target.value})} placeholder="Doctor name or ID" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400" /></label>
        <label className="space-y-2"><span className="text-sm font-medium text-slate-700">Specialization</span><input value={form.specialization ?? ""} onChange={e=>setForm({...form,specialization:e.target.value})} placeholder="e.g. Cardiology" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400" /></label>
        <label className="space-y-2"><span className="text-sm font-medium text-slate-700">Date</span><input type="date" min={today} value={form.date ?? ""} onChange={e=>setForm({...form,date:e.target.value})} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400" /></label>
      </div>
      <div className="mt-5 flex flex-wrap gap-3"><button type="submit" className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">Search Sessions</button><button type="button" onClick={clear} className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Clear</button></div>
    </form>
    {loading ? <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Loading available sessions...</div>
    : error ? <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">{error}<button onClick={()=>void load(form)} className="ml-3 font-semibold underline">Retry</button></div>
    : sessions.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><h2 className="text-xl font-semibold">No matching sessions</h2><p className="mt-2 text-sm text-slate-500">Try a different date or broaden your filters.</p></div>
    : <section className="grid gap-5 lg:grid-cols-2">{sessions.map(session => {
      const available = session.status === "AVAILABLE" && session.remainingAppointments > 0;
      return <article key={session.sessionId} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-900">{session.doctorName}</h2><p className="mt-1 font-medium text-blue-700">{session.specialization}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusTone[session.status]}`}>{statusText[session.status]}</span></div>
        <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2"><p className="flex items-center gap-2"><Hospital className="h-4 w-4 text-blue-600" />{session.hospitalName}</p><p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-600" />{session.sessionDate} · {session.dayOfWeek}</p><p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-blue-600" />{session.startTime}{session.endTime ? ` – ${session.endTime}` : ""}</p><p className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-600" />{session.activeAppointments} active · {session.remainingAppointments} remaining</p></div>
        <div className="mt-6"><Link aria-disabled={!available} href={available ? `/appointments/book/${session.sessionId}` : "#"} className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold ${available ? "bg-blue-600 text-white hover:bg-blue-700" : "pointer-events-none bg-slate-100 text-slate-400"}`}><Stethoscope className="h-4 w-4" />{available ? "Book" : statusText[session.status]}</Link></div>
      </article>;
    })}</section>}
  </AppointmentModuleShell>;
}
