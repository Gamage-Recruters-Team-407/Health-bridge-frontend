"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PrescriptionForm from "@/components/prescription/PrescriptionForm";
import { prescriptionService } from "@/services/prescriptionService";
import { ArrowLeft } from "lucide-react";

export default function CreatePrescriptionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const payload = {
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        notes: data.notes,
        items: data.items,
        validDays: 30,
        patientId: data.patientId || "temp-patient-id",
        doctorId: user.id,
        doctorName: user.fullName || "Unknown Doctor",
        diagnosis: data.diagnosis || "General Checkup",
      };

      const response = await prescriptionService.createPrescription(payload);
      alert("Prescription created successfully!");
      router.push(`/prescriptions/${response.id}`);
    } catch (error) {
      console.error("Error creating prescription:", error);
      alert("Failed to create prescription. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <Link href="/prescriptions" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Prescriptions
      </Link>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create E-Prescription</h1>
        <p className="mt-1 text-sm text-slate-600">Generate a new electronic prescription</p>
      </div>
      
      <PrescriptionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}