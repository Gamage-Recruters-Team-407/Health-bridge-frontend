"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { prescriptionService } from "@/services/prescriptionService";
import QRCodeDisplay from "@/components/prescription/QRCodeDisplay";
import { Navbar } from "@/components/ui/Navbar";

export default function PatientPrescriptionDetails() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    prescriptionService.getPrescriptionById(params.id as string)
      .then(res => setData(res))
      .catch(() => router.push("/patient/medications"));
  }, [params.id, router]);

  if (!data) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100">
      <Navbar title="Prescription Details" userName={data.patientName} userRole="PATIENT" />
      
      <div className="max-w-3xl mx-auto w-full p-10 mt-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Prescription: {data.prescriptionNumber}</h1>
          <button 
            onClick={() => router.push("/patient/medications")}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            &larr; Back to Prescriptions
          </button>
        </div>
        
        <div className="mb-6 p-4 bg-blue-50 dark:bg-slate-800 rounded-lg flex justify-between items-center border border-transparent dark:border-slate-700">
          <div>
            <p className="text-slate-800 dark:text-slate-200"><strong className="text-slate-900 dark:text-white">Doctor:</strong> {data.doctorName}</p>
            <p className="text-slate-800 dark:text-slate-200"><strong className="text-slate-900 dark:text-white">Date:</strong> {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm">
            {/* The QR Code for the Pharmacy to scan */}
            <QRCodeDisplay value={data.prescriptionNumber} size={128} />
          </div>
        </div>

        <h3 className="font-bold mb-3 text-slate-900 dark:text-white">Medicines:</h3>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
          {data.items?.map((item: any) => (
            <li key={item.id || item.medicineId} className="p-4">
              <p className="font-bold text-lg text-slate-900 dark:text-white">{item.medicineName} ({item.dosage})</p>
              <p className="text-slate-600 dark:text-slate-400">{item.frequency} - {item.duration}</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Instructions: {item.instructions}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
