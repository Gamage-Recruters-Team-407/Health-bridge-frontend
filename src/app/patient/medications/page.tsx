"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredUser, AuthUser } from "@/lib/auth";
import DashboardLayout from "@/app/dashboard/layout";
import { Pill, FileText, Download, Calendar } from "lucide-react";

export default function MedicationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  const handleDownload = async (id: string) => {
    import("@/services/prescriptionService").then(async ({ prescriptionService }) => {
      try {
        const blob = await prescriptionService.downloadPrescription(id);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `prescription-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        alert("Failed to download PDF.");
      }
    });
  };

  useEffect(() => {
    import("@/services/prescriptionService").then(({ prescriptionService }) => {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        prescriptionService.getPatientPrescriptions(storedUser.id)
          .then(data => setPrescriptions(data))
          .finally(() => setLoading(false));
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }


  return (
    <DashboardLayout pageTitle="Prescriptions & Medications">
      <main className="flex-1 p-6 sm:p-10 w-full relative">
        <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-10">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Pill className="w-6 h-6 text-blue-600" />
                My Prescriptions
              </h1>
              <p className="text-sm text-slate-500 mt-1">View, track, and download your digital prescriptions.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="p-4 font-bold">Prescription ID</th>
                    <th className="p-4 font-bold">Issued By</th>
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {prescriptions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No prescriptions found.</td>
                    </tr>
                  ) : prescriptions.map((pres) => (
                    <tr key={pres.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <FileText className="w-4 h-4 text-slate-400" />
                          {pres.prescriptionNumber || pres.id}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{pres.items?.length || 0} medications included</div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{pres.doctorName}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {pres.createdAt ? new Date(pres.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          pres.status === "ACTIVE" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : pres.status === "CANCELLED"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          {pres.status || "UNKNOWN"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/patient/medications/${pres.id}`} className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition">
                            View
                          </Link>
                          <button onClick={() => handleDownload(pres.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition shadow-sm">
                            <Download className="w-4 h-4" /> PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
