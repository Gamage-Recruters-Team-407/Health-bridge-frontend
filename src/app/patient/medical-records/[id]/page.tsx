import Link from "next/link";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const recordData = {
  "MR-001": {
    id: "MR-001",
    date: "12 Aug 2026",
    type: "Annual Checkup",
    doctor: "Dr. Elena Park",
    hospital: "Health Bridge Medical Center",
    diagnosis: "Stable Hypertension",
    summary:
      "Patient attended annual review. Blood pressure remains controlled and glucose measurements have improved compared with the previous review.",
    symptoms: ["Occasional headache", "Mild fatigue"],
    treatment: [
      "Continue Lisinopril 10mg daily",
      "Continue Metformin 500mg twice daily",
      "Maintain regular exercise",
      "Monitor blood pressure weekly",
    ],
    notes:
      "Patient is clinically stable. Continue current treatment plan and review again in six months.",
  },

  "MR-002": {
    id: "MR-002",
    date: "03 May 2026",
    type: "Follow-up Visit",
    doctor: "Dr. Marcus Lee",
    hospital: "Health Bridge Medical Center",
    diagnosis: "Post-operative Follow-up",
    summary:
      "Patient attended follow-up appointment following previous procedure. Recovery is progressing without significant complications.",
    symptoms: ["Mild discomfort"],
    treatment: [
      "Continue prescribed medication",
      "Maintain wound care",
      "Return if pain or swelling increases",
    ],
    notes:
      "Recovery progressing normally. No signs of infection identified during this visit.",
  },

  "MR-003": {
    id: "MR-003",
    date: "18 Jan 2026",
    type: "Emergency Visit",
    doctor: "Dr. Nina Shah",
    hospital: "Health Bridge Emergency Department",
    diagnosis: "Acute Migraine",
    summary:
      "Patient presented with severe headache and nausea. Clinical examination was completed and symptoms improved after treatment.",
    symptoms: ["Severe headache", "Nausea", "Light sensitivity"],
    treatment: [
      "Acute migraine medication",
      "Hydration",
      "Rest",
      "Follow up with primary physician if symptoms recur",
    ],
    notes:
      "Patient improved after treatment and was discharged in stable condition.",
  },
};

export default async function MedicalRecordDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const record =
    recordData[id as keyof typeof recordData] ??
    recordData["MR-001"];

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-5 lg:px-8 lg:py-8">
        {/* BACK */}
        <Link
          href="/patient/medical-records"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Medical Records
        </Link>

        {/* HEADER */}
        <header className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                {record.id}
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
                {record.type}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {record.date}
              </p>
            </div>

            <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              Completed
            </span>
          </div>
        </header>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* MAIN */}
          <section className="min-w-0 space-y-5">
            <Card title="Clinical Summary">
              <p className="text-sm leading-6 text-slate-600">
                {record.summary}
              </p>
            </Card>

            <Card title="Diagnosis">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-bold text-blue-800">
                  {record.diagnosis}
                </p>
              </div>
            </Card>

            <Card title="Reported Symptoms">
              <div className="flex flex-wrap gap-2">
                {record.symptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </Card>

            <Card title="Treatment Plan">
              <div className="space-y-2">
                {record.treatment.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl bg-slate-50 p-3"
                  >
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {index + 1}
                    </div>

                    <p className="pt-0.5 text-xs leading-5 text-slate-600">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Consultation Notes">
              <p className="text-sm leading-6 text-slate-600">
                {record.notes}
              </p>
            </Card>
          </section>

          {/* SIDEBAR */}
          <aside className="space-y-5">
            <Card title="Healthcare Provider">
              <InfoRow label="Doctor" value={record.doctor} />
              <InfoRow label="Facility" value={record.hospital} />
              <InfoRow label="Visit Date" value={record.date} />
            </Card>

            <Card title="Record Actions">
              <div className="space-y-2">
                <button className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700">
                  Download Record
                </button>

                <button className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  Share Record
                </button>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-950">
        {title}
      </h2>

      {children}
    </section>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-xs font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}