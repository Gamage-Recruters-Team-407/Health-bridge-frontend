"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { appointmentService } from "@/services/appointmentService";
import type { DoctorSession } from "@/types/appointment";
import HospitalSelect from "@/components/forms/HospitalSelect";

export default function DoctorAppointmentsPage() {
  const [sessions, setSessions] = useState<DoctorSession[]>([]);
  const [branch, setBranch] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { appointmentService.getMySessions().then(setSessions).catch((e) => setError(e instanceof Error ? e.message : "Unable to load sessions.")); }, []);
  const visible = useMemo(() => sessions.filter((session) => !branch || session.hospitalId === branch), [sessions, branch]);
  return <div className="space-y-6">
    <div><p className="text-xs font-bold uppercase tracking-widest text-teal-700">Patient queues</p><h1 className="mt-2 text-3xl font-bold">Session appointments</h1><p className="mt-1 text-sm text-slate-500">Open a session to manage its numbered queue across your hospital branches.</p></div>
    {error && <div className="rounded-xl bg-rose-50 p-4 text-rose-700">{error}</div>}
    {sessions.length > 0 && <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-4"><HospitalSelect value={branch} onChange={(id) => setBranch(id)} placeholder="Filter by hospital branch" /></div>}
    {!error && visible.length === 0 ? <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-lg font-bold text-slate-900">{sessions.length ? "No sessions in this branch" : "No sessions created yet"}</h2><p className="mt-2 text-sm text-slate-500">{sessions.length ? "Choose another branch to view its queues." : "Create your first branch-specific session before accepting appointments."}</p><Link href="/doctor/schedule" className="mt-5 inline-flex rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white">Create a Session</Link></section> : <div className="grid gap-4 lg:grid-cols-2">{visible.map((session) => <article key={session.sessionId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex justify-between gap-4"><div><h2 className="font-bold">{session.sessionDate} · {session.startTime}</h2><p className="mt-1 text-sm text-slate-500">{session.hospitalName} · {session.specialization}</p></div><span className="h-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">{session.status}</span></div><p className="mt-4 text-sm font-semibold">{session.activeAppointments} / {session.maxAppointments} booked · {session.remainingAppointments} remaining</p><Link href={`/doctor/sessions/${session.sessionId}/queue`} className="mt-5 inline-flex rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white">View Queue</Link></article>)}</div>}
  </div>;
}
