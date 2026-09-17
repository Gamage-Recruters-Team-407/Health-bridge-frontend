"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/app/dashboard/layout";
import { useHospital } from "@/context/HospitalContext";
import { ComplianceReport } from "@/types/hospital";
import { ArrowLeft, Shield, Calendar, User, FileText, Printer } from "lucide-react";

interface ComplianceReportViewPageProps {
  params: Promise<{ id: string }>;
}

export default function ComplianceReportViewPage({ params }: ComplianceReportViewPageProps) {
  const { complianceReports, complianceLoading } = useHospital();
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setId(resolved.id);
    };
    resolveParams();
  }, [params]);

  const report = id ? complianceReports.find((r) => r.id === id) ?? null : null;
  const loading = !id || complianceLoading;

  if (loading || complianceLoading) {
    return (
      <DashboardLayout pageTitle="Compliance Report">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading report...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout pageTitle="Compliance Report">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-700">Report Not Found</h3>
          <p className="text-sm text-red-600 mt-1">The compliance report you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/hospital/billing/compliance"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Compliance
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <DashboardLayout pageTitle="Compliance Report Details">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/hospital/billing/compliance"
          className="p-2 hover:bg-slate-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compliance Report</h1>
          <p className="text-sm text-slate-500 mt-1">View report details and summary</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">{report.reportType || "Compliance Report"}</h2>
              <p className="text-purple-100 text-sm">Period: {report.period || "N/A"}</p>
            </div>
            <span className={`ml-auto px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(report.status)}`}>
              {report.status || "DRAFT"}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Shield className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Report Type</p>
                  <p className="text-sm font-semibold text-slate-900">{report.reportType || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <User className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Prepared By</p>
                  <p className="text-sm font-semibold text-slate-900">{report.preparedBy || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Calendar className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Report Date</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {report.reportDate ? new Date(report.reportDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Created At</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-700">Summary</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{report.summary || "No summary provided"}</p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-slate-100">
            <Link
              href={`/hospital/billing/compliance/${report.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition"
            >
              Edit Report
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-xl transition"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <Link
              href="/hospital/billing/compliance"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-xl transition ml-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}