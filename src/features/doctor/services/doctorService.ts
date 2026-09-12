import api from "@/lib/axios";
import { getStoredUser } from "@/lib/auth";
import { mockAvailability, mockDoctors, mockEarnings, mockLeaves } from "../constants";
import type { Availability, AvailabilityInput, Doctor, DoctorLeave, DoctorProfileUpdate, Earnings, LeaveInput } from "../types";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_DOCTOR_MOCKS !== "false";
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
const getDoctorId = () => {
  const user = getStoredUser();
  if (!user) return "doc-002";
  if (user.id.startsWith("doc-")) return user.id;

  const email = user.email.trim().toLowerCase();
  if (email === "doctor@healthbridge.lk") return "doc-002";

  const name = user.fullName.trim().toLowerCase();
  if (name.includes("maya perera")) return "doc-002";
  if (name.includes("robert chen")) return "doc-001";
  return user.id;
};
let profile = { ...mockDoctors[0] };
let availability = [...mockAvailability];
let leaves = [...mockLeaves];

export async function getDoctorProfile(): Promise<Doctor> {
  if (USE_MOCKS) { await delay(); return { ...profile }; }
  return await api.get<Doctor>("/doctors/me");
}

export async function updateDoctorProfile(data: DoctorProfileUpdate): Promise<Doctor> {
  if (USE_MOCKS) { await delay(); profile = { ...profile, ...data }; return { ...profile }; }
  return await api.put<Doctor>("/doctors/me", data);
}

export async function getDoctors(): Promise<Doctor[]> {
  if (USE_MOCKS) { await delay(); return mockDoctors.map((doctor) => ({ ...doctor })); }
  return await api.get<Doctor[]>("/doctors");
}

export async function getAvailability(): Promise<Availability[]> {
  if (USE_MOCKS) { await delay(); return availability.map((slot) => ({ ...slot })); }
  return await api.get<Availability[]>(`/doctors/me/availability?doctorId=${encodeURIComponent(getDoctorId())}`);
}

export async function updateAvailability(slots: AvailabilityInput[]): Promise<Availability[]> {
  if (USE_MOCKS) { await delay(); availability = slots.map((slot, index) => ({ ...slot, id: `slot-${Date.now()}-${index}` })); return availability; }
  return await api.put<Availability[]>(`/doctors/me/availability?doctorId=${encodeURIComponent(getDoctorId())}`, slots);
}

export async function createLeave(data: LeaveInput): Promise<DoctorLeave> {
  if (USE_MOCKS) { await delay(); const leave: DoctorLeave = { ...data, id: `leave-${Date.now()}`, status: "Pending", appliedAt: new Date().toISOString().slice(0, 10) }; leaves = [leave, ...leaves]; return leave; }
  return await api.post<DoctorLeave>("/doctors/me/leaves", data);
}

export async function getLeaves(): Promise<DoctorLeave[]> {
  if (USE_MOCKS) { await delay(); return leaves.map((leave) => ({ ...leave })); }
  return await api.get<DoctorLeave[]>("/doctors/me/leaves");
}

export async function getEarnings(): Promise<Earnings> {
  if (USE_MOCKS) { await delay(); return structuredClone(mockEarnings); }
  return await api.get<Earnings>("/doctors/me/earnings");
}

export const doctorService = { getDoctorProfile, updateDoctorProfile, getDoctors, getAvailability, updateAvailability, createLeave, getLeaves, getEarnings };
