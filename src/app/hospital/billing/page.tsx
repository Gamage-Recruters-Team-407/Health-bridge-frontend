"use client";

import React from "react";
import Link from "next/link";
import DashboardLayout from "@/app/dashboard/layout";
import { useHospital } from "@/context/HospitalContext";
import { InvoiceCard } from "@/components/hospital/billing/InvoiceCard";
import { Plus, FileText } from "lucide-react";

export default function BillingPage() {
  const {
    invoices,
    invoicesLoading,
    invoicesError,
    deleteInvoice,
  } = useHospital();

  if (invoicesLoading) {
    return (
      <DashboardLayout pageTitle="Billing Management">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading invoices...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (invoicesError) {
    return (
      <DashboardLayout pageTitle="Billing Management">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          <p className="font-medium">❌ Error loading invoices</p>
          <p className="text-sm mt-1">{invoicesError}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Billing Management">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage patient invoices and billing history</p>
        </div>
        <Link
          href="/hospital/billing/invoices/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Invoices</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Paid</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {invoices.filter(i => i.paymentStatus === "PAID").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Unpaid</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {invoices.filter(i => i.paymentStatus === "UNPAID").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            ${invoices.reduce((sum, i) => sum + (i.total || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Invoices Grid */}
      {invoices.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No invoices found</h3>
          <p className="text-sm text-slate-500 mt-1">Create your first invoice to get started.</p>
          <Link
            href="/hospital/billing/invoices/create"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onDelete={deleteInvoice}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}