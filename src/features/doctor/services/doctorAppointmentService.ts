import api from "@/lib/axios";
import { getStoredUser } from "@/lib/auth";
import { Appointment } from "@/types/appointment";

export type DoctorDecision = "PENDING" | "ACCEPTED" | "REJECTED";

export type DoctorAppointment = Appointment & {
  doctorDecision: DoctorDecision;
};

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

const normalizeDecision = (appointment: DoctorAppointment): DoctorAppointment => ({
  ...appointment,
  doctorDecision: appointment.doctorDecision ||
    (appointment.status === "COMPLETED" ? "ACCEPTED" : appointment.status === "CANCELLED" ? "REJECTED" : "PENDING"),
});

export async function getDoctorAppointments(): Promise<DoctorAppointment[]> {
  const appointments = await api.get<DoctorAppointment[]>(
    `/appointments?doctorId=${encodeURIComponent(getDoctorId())}`
  );
  return appointments.map(normalizeDecision);
}

export async function updateDoctorAppointmentDecision(
  appointment: DoctorAppointment,
  decision: DoctorDecision
): Promise<DoctorAppointment> {
  return api.patch<DoctorAppointment>(
    `/appointments/${encodeURIComponent(appointment.id)}/decision?decision=${decision}`
  );
}

export async function markAppointmentCompleted(
  appointment: DoctorAppointment
): Promise<DoctorAppointment> {
  return api.patch<DoctorAppointment>(`/appointments/${encodeURIComponent(appointment.id)}/complete`);
}
