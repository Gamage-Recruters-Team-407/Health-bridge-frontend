"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { prescriptionService } from "@/services/prescriptionService";
import PrescriptionForm from "@/components/prescription/PrescriptionForm";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditPrescriptionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    prescriptionService
      .getPrescriptionById(id)
      .then((data) => {
        setInitialData({
          patientId: data.patientId,
          patientName: data.patientName,
          patientPhone: data.patientPhone,
          diagnosis: data.diagnosis || "",
          notes: data.notes || "",
          items: data.items,
        });
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await prescriptionService.updatePrescription(id, {
        notes: data.notes,
        diagnosis: data.diagnosis,
        items: data.items,
      });
      router.push(`/prescriptions/${id}`);
    } catch (error) {
      alert("Failed to update prescription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (loadError || !initialData) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-rose-600">Failed to load prescription. Please go back and try again.</p>
        <Link href={`/prescriptions/${id}`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-md text-xs font-semibold text-slate-600 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"><ArrowLeft className="w-4 h-4" /> Back to Details</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href={`/prescriptions/${id}`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-md text-xs font-semibold text-slate-600 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"><ArrowLeft className="w-4 h-4" /> Back to Details</Link>
      <div><h1 className="text-2xl font-bold text-slate-900">Edit Prescription</h1></div>
      <PrescriptionForm mode="edit" initialData={initialData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}