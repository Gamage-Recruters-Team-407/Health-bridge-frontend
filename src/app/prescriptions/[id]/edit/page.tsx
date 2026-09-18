"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { prescriptionService } from "@/services/prescriptionService";
import PrescriptionForm from "@/components/prescription/PrescriptionForm";

export default function EditPrescriptionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await prescriptionService.getPrescriptionById(id);
        setInitialData({
          patientName: data.patientName,
          patientPhone: data.patientPhone,
          notes: data.notes || "",
          items: data.items,
        });
      } catch (error) {
        console.error("Error fetching prescription:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await prescriptionService.updatePrescription(id, {
        notes: data.notes,
        items: data.items,
      });
      alert("Prescription updated successfully!");
      router.push(`/prescriptions/${id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update prescription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f7f9fc]"><p className="text-sm text-slate-500">Loading prescription data...</p></div>;
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-5 lg:px-8 lg:py-8">
        <Link href={`/prescriptions/${id}`} className="text-xs font-semibold text-blue-600 hover:text-blue-700">← Back to Details</Link>
        <header className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">Prescription Management</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Edit Prescription</h1>
        </header>
        
        <div className="mt-6">
          <PrescriptionForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </main>
  );
}