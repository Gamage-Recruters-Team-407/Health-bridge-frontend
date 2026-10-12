/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { Camera, Save } from "lucide-react";
import type { Doctor, DoctorProfileUpdate } from "../types";
import { validatePhoneNumber, validateProfile, validateProfilePhoto } from "../validations";

const inputClass = "mt-1.5 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export default function DoctorProfileForm({ doctor, onSave }: { doctor: Doctor; onSave: (data: DoctorProfileUpdate) => Promise<void> }) {
  const initial: DoctorProfileUpdate = {
    fullName: doctor.fullName, email: doctor.email, phoneNumber: doctor.phoneNumber,
    profileImage: doctor.profileImage, gender: doctor.gender, dateOfBirth: doctor.dateOfBirth,
    address: doctor.address, specialization: doctor.specialization,
    qualifications: doctor.qualifications, experience: doctor.experience,
    consultationFee: doctor.consultationFee, bio: doctor.bio,
  };
  const [form, setForm] = useState<DoctorProfileUpdate>(initial);
  const [qualifications, setQualifications] = useState(initial.qualifications.join(", "));
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);
  const phoneError = phoneTouched ? validatePhoneNumber(form.phoneNumber) : "";
  const update = (key: keyof DoctorProfileUpdate, value: string | number) => setForm((current) => ({ ...current, [key]: value }));

  async function selectPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const error = validateProfilePhoto(file);
    if (error) { setMessage(error); return; }
    setPhotoLoading(true);
    setMessage("");
    try {
      const image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Unable to read the photo."));
        reader.readAsDataURL(file);
      });
      await new Promise<void>((resolve, reject) => {
        const preview = new Image();
        preview.onload = () => resolve();
        preview.onerror = () => reject(new Error("This file is not a readable image."));
        preview.src = image;
      });
      update("profileImage", image);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load the photo.");
    } finally { setPhotoLoading(false); }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPhoneTouched(true);
    const next = { ...form, phoneNumber: form.phoneNumber.replace(/[\s()-]/g, ""), qualifications: qualifications.split(",").map((item) => item.trim()).filter(Boolean) };
    const validation = validateProfile(next);
    if (validation) { setMessage(validation); return; }
    setSaving(true);
    try {
      await onSave(next); setEditing(false); setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save your profile.");
    } finally { setSaving(false); }
  }

  return <form onSubmit={submit} className="space-y-6">
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="relative">{ }<img src={form.profileImage} alt={form.fullName} className="h-24 w-24 rounded-lg object-cover" />{editing && <button type="button" aria-label="Upload profile photo" disabled={saving || photoLoading} onClick={() => photoInput.current?.click()} className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white disabled:opacity-60"><Camera className="h-4 w-4" /></button>}</div><div className="flex-1"><h2 className="text-xl font-bold">{form.fullName}</h2><p className="mt-1 text-sm font-medium text-blue-700">{form.specialization}</p><p className="mt-2 text-sm text-slate-500">{form.qualifications.join(" | ")} · {form.experience} years experience</p></div><button type="button" disabled={saving || photoLoading} onClick={() => { if (editing) { setForm(initial); setQualifications(initial.qualifications.join(", ")); } setEditing((value) => !value); setMessage(""); setPhoneTouched(false); }} className="h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold hover:bg-slate-50">{editing ? "Cancel editing" : "Edit profile"}</button></div></section>
    {message && <p className={`rounded-md px-4 py-3 text-sm ${message.includes("successfully") ? "bg-blue-50 text-blue-700" : "bg-rose-50 text-rose-700"}`}>{message}</p>}
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="mb-5 text-base font-bold">Personal information</h2><fieldset disabled={!editing || saving} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Label text="Full name"><input className={inputClass} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} /></Label>
      <Label text="Email"><input type="email" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} /></Label>
      <Label text="Phone number"><input type="tel" autoComplete="tel" required aria-invalid={!!phoneError} aria-describedby="doctor-phone-help" className={inputClass} value={form.phoneNumber} onBlur={() => setPhoneTouched(true)} onChange={(e) => { update("phoneNumber", e.target.value); setPhoneTouched(true); }} /><span id="doctor-phone-help" className={`mt-1 block ${phoneError ? "text-rose-600" : "text-slate-500"}`}>{phoneError || "Use 0771234567 or +94771234567."}</span></Label>
      <Label text="Gender"><select className={inputClass} value={form.gender} onChange={(e) => update("gender", e.target.value)}><option>Female</option><option>Male</option><option>Other</option></select></Label>
      <Label text="Date of birth"><input type="date" className={inputClass} value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} /></Label>
      <Label text="Profile photo"><input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" disabled={saving || photoLoading} onChange={selectPhoto} className="mt-2 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700" /><span className="mt-2 block text-slate-500">{photoLoading ? "Loading photo..." : "JPG, PNG, or WebP up to 2 MB. Save changes to keep your photo."}</span></Label>
      <div className="sm:col-span-2"><Label text="Address"><input className={inputClass} value={form.address} onChange={(e) => update("address", e.target.value)} /></Label></div>
    </fieldset></section>
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="mb-5 text-base font-bold">Professional details</h2><fieldset disabled={!editing || saving} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Label text="Specialization"><input className={inputClass} value={form.specialization} onChange={(e) => update("specialization", e.target.value)} /></Label>
      <Label text="Qualifications (comma separated)"><input className={inputClass} value={qualifications} onChange={(e) => setQualifications(e.target.value)} /></Label>
      <Label text="Experience (years)"><input type="number" min="0" className={inputClass} value={form.experience} onChange={(e) => update("experience", Number(e.target.value))} /></Label>
      <Label text="Consultation fee (LKR)"><input type="number" min="0" className={inputClass} value={form.consultationFee} onChange={(e) => update("consultationFee", Number(e.target.value))} /></Label>
    </fieldset>{editing && <div className="mt-6 flex justify-end"><button disabled={saving || photoLoading} className="flex h-11 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"><Save className="h-4 w-4" />{saving ? "Saving..." : "Save changes"}</button></div>}</section>
  </form>;
}

function Label({ text, children }: { text: string; children: React.ReactNode }) { return <label className="block text-xs font-semibold text-slate-600">{text}{children}</label>; }
