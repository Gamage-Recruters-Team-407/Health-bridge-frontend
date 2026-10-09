import type { FormEvent, ReactNode } from "react";
import type { BookingInput, SessionStatus } from "@/types/appointment";

type PatientDetailsFormProps = {
  error: string;
  form: BookingInput;
  isSubmitting: boolean;
  sessionStatus: SessionStatus;
  onBack: () => void;
  onChange: (field: keyof BookingInput, value: string) => void;
  onSubmit: () => Promise<void>;
};

const INPUT_STYLES =
  "w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400";

export default function PatientDetailsForm({
  error,
  form,
  isSubmitting,
  sessionStatus,
  onBack,
  onChange,
  onSubmit,
}: PatientDetailsFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-slate-900">Patient details</h2>
      <p className="mt-1 text-sm text-slate-500">
        Your appointment number is assigned securely after confirmation.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Full Name *">
          <input
            required
            maxLength={120}
            value={form.patientName}
            onChange={(event) => onChange("patientName", event.target.value)}
            className={INPUT_STYLES}
          />
        </Field>

        <Field label="Phone *">
          <input
            required
            inputMode="tel"
            value={form.patientPhone}
            onChange={(event) => onChange("patientPhone", event.target.value)}
            className={INPUT_STYLES}
          />
        </Field>

        <Field label="NIC / Passport *">
          <input
            required
            minLength={5}
            maxLength={30}
            value={form.nicOrPassport}
            onChange={(event) => onChange("nicOrPassport", event.target.value)}
            className={INPUT_STYLES}
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            value={form.email ?? ""}
            onChange={(event) => onChange("email", event.target.value)}
            className={INPUT_STYLES}
          />
        </Field>

        <Field label="Address" fullWidth>
          <textarea
            rows={3}
            maxLength={300}
            value={form.address ?? ""}
            onChange={(event) => onChange("address", event.target.value)}
            className={`${INPUT_STYLES} resize-none`}
          />
        </Field>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting || sessionStatus !== "AVAILABLE"}
          className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Confirming..." : "Confirm Appointment"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  fullWidth = false,
  children,
}: {
  label: string;
  fullWidth?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`space-y-2 ${fullWidth ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
