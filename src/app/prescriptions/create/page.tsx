"use client";

import Link from "next/link";
import { useState } from "react";
import PrescriptionForm from "@/components/prescription/PrescriptionForm";

export default function CreatePrescriptionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // await prescriptionService.createPrescription(data);
      alert("Prescription created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create prescription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-5 lg:px-8 lg:py-8">
        <Link href="/prescriptions" className="text-xs font-semibold text-blue-600 hover:text-blue-700">← Back to Prescriptions</Link>
        <header className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">Prescription Management</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Create E-Prescription</h1>
        </header>
        
        <div className="mt-6">
          <PrescriptionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </main>
  );
}