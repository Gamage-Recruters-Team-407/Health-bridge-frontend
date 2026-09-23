"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppointmentModuleShell from "@/components/appointment/AppointmentModuleShell";
import { appointmentService } from "@/services/appointmentService";
import type { Appointment } from "@/types/appointment";

type Tab = "Upcoming" | "Completed" | "Cancelled";
export default function AppointmentsPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [tab, setTab] = useState<Tab>("Upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancel, setCancel] = useState<Appointment | null>(null);
  const [reason, setReason] = useState("");
  const load = useCallback(async () => { try { setLoading(true); setError(""); setItems(await appointmentService.getAppointments()); } catch(e) { setError(e instanceof Error ? e.message : "Unable to load appointments."); } finally { setLoading(false); } },[]);
  useEffect(()=>{ const timer=window.setTimeout(()=>void load(),0); return()=>window.clearTimeout(timer); },[load]);
  const visible = useMemo(()=>items.filter(a => tab === "Upcoming" ? ["BOOKED","UPCOMING"].includes(a.status) : tab === "Completed" ? ["COMPLETED","NO_SHOW"].includes(a.status) : a.status === "CANCELLED"),[items,tab]);
  const confirmCancel = async () => { if (!cancel) return; try { await appointmentService.cancelAppointment({appointmentId:cancel.appointmentId,reason}); setCancel(null); setReason(""); await load(); } catch(e) { setError(e instanceof Error ? e.message : "Unable to cancel appointment."); } };
  return <AppointmentModuleShell title="My Appointments" subtitle="Track upcoming channeling sessions, history, and live queue numbers." action={<Link href="/appointments/search-doctor" className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Find a Session</Link>}>
    <div className="flex flex-wrap gap-2 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">{(["Upcoming","Completed","Cancelled"] as Tab[]).map(value=><button key={value} onClick={()=>setTab(value)} className={`rounded-full px-5 py-2 text-sm font-semibold ${tab===value?"bg-blue-600 text-white":"bg-slate-100 text-slate-600"}`}>{value} <span className="ml-1 opacity-75">{items.filter(a=>value==="Upcoming"?["BOOKED","UPCOMING"].includes(a.status):value==="Completed"?["COMPLETED","NO_SHOW"].includes(a.status):a.status==="CANCELLED").length}</span></button>)}</div>
    {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
    {loading ? <div className="rounded-3xl border bg-white p-12 text-center text-sm text-slate-500">Loading appointments...</div>
    : visible.length===0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><h2 className="text-xl font-semibold">No {tab.toLowerCase()} appointments</h2><p className="mt-2 text-sm text-slate-500">Appointments in this category will appear here.</p></div>
    : <div className="space-y-4">{visible.map(a=>{const today=a.date===new Date().toISOString().slice(0,10);const ahead=Math.max(a.appointmentNumber-a.currentQueueNumber-1,0);return <article key={a.appointmentId} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-bold text-slate-900">{a.doctorName}</h2><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{a.status}</span></div><p className="mt-1 text-sm text-blue-700">{a.specialization} · {a.hospitalName}</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500"><span>Ref: {a.referenceNumber}</span><span>No. {String(a.appointmentNumber).padStart(2,"0")}</span><span>{a.date} at {a.sessionTime}</span>{today&&["BOOKED","UPCOMING"].includes(a.status)&&<span className="font-semibold text-emerald-700">Current {String(a.currentQueueNumber).padStart(2,"0")} · {ahead} ahead</span>}</div></div><div className="flex flex-wrap gap-2"><Link href={`/appointments/${a.appointmentId}`} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">View</Link>{["BOOKED","UPCOMING"].includes(a.status)&&<><Link href={`/appointments/${a.appointmentId}`} className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700">Reschedule</Link><button onClick={()=>setCancel(a)} className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700">Cancel</button></>}</div></div></article>})}</div>}
    {cancel&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><div className="w-full max-w-lg rounded-3xl bg-white p-6"><h2 className="text-xl font-bold">Cancel appointment?</h2><p className="mt-2 text-sm text-slate-500">Appointment #{cancel.appointmentNumber} will remain in your history and its number will not be reused.</p><textarea rows={3} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Reason (optional)" className="mt-5 w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none"/><div className="mt-5 flex justify-end gap-3"><button onClick={()=>setCancel(null)} className="rounded-xl border px-4 py-2 text-sm font-semibold">Keep</button><button onClick={()=>void confirmCancel()} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Confirm cancellation</button></div></div></div>}
  </AppointmentModuleShell>;
}
