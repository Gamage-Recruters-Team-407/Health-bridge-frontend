"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PrescriptionForm from "@/components/prescription/PrescriptionForm";

export default function EditPrescriptionPage() {
  const params = useParams();
  const id = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setInitialData({
        patientName: "Ava Thompson",
        patientPhone: "+94 77 123 4567",
        notes: "Take medicines after meals. Avoid alcohol.",
        items: [
          { medicineId: "med1", medicineName: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days", quantity: 30, instructions: "Morning" },
        ],
      });
    }, 500);
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // await prescriptionService.updatePrescription(id, data);
      alert("Prescription updated successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialData) return <div className="p-10 text-center">Loading prescription data...</div>;

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