"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { ComplianceReportForm } from "@/components/hospital/billing/ComplianceReportForm";
import { useHospital } from "@/context/HospitalContext";
import { ComplianceReportRequest } from "@/types/hospital";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function CreateComplianceReportPage() {
  const router = useRouter();
  const { createComplianceReport, complianceLoading } = useHospital();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ComplianceReportRequest) => {
    setIsLoading(true);
    try {
      await createComplianceReport(data);
      router.push('/hospital/billing/compliance');
    } catch (error) {
      console.error('Failed to create compliance report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/hospital/billing/compliance');
  };

  return (
    <DashboardLayout pageTitle="Create Compliance Report">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/hospital/billing/compliance"
          className="p-2 hover:bg-slate-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Compliance Report</h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate a new regulatory or operational compliance report
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <ComplianceReportForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading || complianceLoading}
        />
      </div>
    </DashboardLayout>
  );
}