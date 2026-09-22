"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { prescriptionService } from "@/services/prescriptionService";
import PrescriptionForm from "@/components/prescription/PrescriptionForm";
import { ArrowLeft } from "lucide-react";

export default function EditPrescriptionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prescriptionService.getPrescriptionById(id).then(data => {
      setInitialData({ patientId: data.patientId, patientName: data.patientName, patientPhone: data.patientPhone, notes: data.notes || "", items: data.items });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await prescriptionService.updatePrescription(id, { notes: data.notes, items: data.items });
      router.push("/prescriptions");
    } catch (error) {
      alert("Failed to update prescription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex min-h-64 items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <Link href={`/prescriptions/${id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600"><ArrowLeft className="w-4 h-4" /> Back to Details</Link>
      <div><h1 className="text-2xl font-bold text-slate-900">Edit Prescription</h1></div>
      <PrescriptionForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}