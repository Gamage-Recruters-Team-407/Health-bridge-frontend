import { CalendarDays, Clock3, Hospital, Users } from "lucide-react";
import type { DoctorSession } from "@/types/appointment";

type SessionSummaryProps = {
  session: DoctorSession;
};

export default function SessionSummary({ session }: SessionSummaryProps) {
  return (
    <aside className="h-fit rounded-3xl border border-blue-100 bg-blue-50 p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
        Session summary
      </p>
      <h2 className="mt-3 text-2xl font-bold text-slate-900">
        {session.doctorName}
      </h2>
      <p className="mt-1 font-medium text-blue-700">{session.specialization}</p>

      <div className="mt-6 space-y-4 text-sm text-slate-700">
        <SummaryItem icon={Hospital}>{session.hospitalName}</SummaryItem>
        <SummaryItem icon={CalendarDays}>
          {session.sessionDate} · {session.dayOfWeek}
        </SummaryItem>
        <SummaryItem icon={Clock3}>
          {session.startTime}
          {session.endTime ? ` – ${session.endTime}` : ""}
        </SummaryItem>
        <SummaryItem icon={Users}>
          {session.activeAppointments} booked · {session.remainingAppointments}{" "}
          remaining
        </SummaryItem>
      </div>
    </aside>
  );
}

type SummaryIcon = typeof Hospital;

function SummaryItem({
  icon: Icon,
  children,
}: {
  icon: SummaryIcon;
  children: React.ReactNode;
}) {
  return (
    <p className="flex gap-3">
      <Icon className="h-5 w-5 shrink-0 text-blue-600" />
      <span>{children}</span>
    </p>
  );
}
