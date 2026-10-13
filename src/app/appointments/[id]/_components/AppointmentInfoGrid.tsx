import type { Appointment } from "@/types/appointment";

type AppointmentInfoGridProps = {
  appointment: Appointment;
};

export default function AppointmentInfoGrid({
  appointment,
}: AppointmentInfoGridProps) {
  const details = [
    { label: "Reference Number", value: appointment.referenceNumber },
    {
      label: "Appointment Number",
      value: formatAppointmentNumber(appointment.appointmentNumber),
    },
    { label: "Status", value: appointment.status },
    { label: "Doctor", value: appointment.doctorName },
    { label: "Specialization", value: appointment.specialization },
    { label: "Hospital", value: appointment.hospitalName },
    { label: "Date", value: appointment.date },
    { label: "Session Time", value: appointment.sessionTime },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {details.map((detail) => (
        <InfoItem key={detail.label} {...detail} />
      ))}
    </div>
  );
}

export function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-900">{value || "—"}</p>
    </div>
  );
}

export function formatAppointmentNumber(value: number) {
  return String(value).padStart(2, "0");
}
