import type { DoctorSession } from "@/types/appointment";

type RescheduleModalProps = {
  sessions: DoctorSession[];
  onClose: () => void;
  onSelect: (sessionId: string) => void;
};

export default function RescheduleModal({
  sessions,
  onClose,
  onSelect,
}: RescheduleModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reschedule-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
    >
      <div className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-3xl bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 id="reschedule-title" className="text-xl font-bold">
            Choose a new session
          </h2>
          <button type="button" onClick={onClose} className="text-slate-500">
            Close
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <button
                key={session.sessionId}
                type="button"
                onClick={() => onSelect(session.sessionId)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-4 text-left hover:border-blue-300"
              >
                <span>
                  <strong className="block">
                    {session.doctorName} · {session.specialization}
                  </strong>
                  <span className="text-sm text-slate-500">
                    {session.hospitalName} · {session.sessionDate} at{" "}
                    {session.startTime}
                  </span>
                </span>
                <span className="text-sm font-semibold text-blue-700">
                  Select
                </span>
              </button>
            ))
          ) : (
            <p className="py-8 text-center text-slate-500">
              No alternative sessions are currently available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
