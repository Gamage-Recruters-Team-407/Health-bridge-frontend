"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { invoiceService } from "@/services/invoiceService";
import { Invoice } from "@/types/invoice";

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    try {
      setLoading(true);
      setError("");
      const data = await invoiceService.getAll();
      setInvoices(data);
    } catch (error: any) {
      console.error("Failed to load invoices:", error);
      setError(error?.response?.data?.message || error?.message || "Failed to load invoices. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + (invoice.totalAmount || invoice.grandTotal || 0),
    0
  );

  const paidInvoices = invoices.filter(
    (invoice) =>
      invoice.paymentStatus === "PAID" || invoice.paymentStatus === "paid"
  ).length;

  const unpaidInvoices = invoices.filter(
    (invoice) =>
      invoice.paymentStatus === "UNPAID" ||
      invoice.paymentStatus === "unpaid" ||
      invoice.paymentStatus === "PENDING" ||
      invoice.paymentStatus === "pending"
  ).length;

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <p className="text-lg font-semibold">⚠️ Connection Error</p>
          <p className="mt-2 text-sm">{error}</p>
          <button
            onClick={() => loadInvoices()}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Billing</h1>
          <p className="text-sm text-gray-500">Manage hospital invoices and billing</p>
        </div>

        <Link
          href="/hospital/billing/create"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Create Invoice
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Rs. {totalRevenue.toFixed(2)}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Paid Invoices</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">{paidInvoices}</h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Unpaid Invoices</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">{unpaidInvoices}</h2>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3.5 font-medium text-gray-600">Invoice</th>
                <th className="px-4 py-3.5 font-medium text-gray-600">Patient</th>
                <th className="px-4 py-3.5 font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3.5 font-medium text-gray-600">Payment</th>
                <th className="px-4 py-3.5 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3.5 text-right font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3.5 font-medium text-gray-900">
                      {invoice.invoiceNumber || invoice.id.slice(0, 8)}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-gray-900">
                        {invoice.patientName}
                      </div>
                      <div className="text-xs text-gray-500">{invoice.patientId}</div>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-gray-900">
                      Rs. {(invoice.totalAmount || invoice.grandTotal || 0).toFixed(2)}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          invoice.paymentStatus === "PAID" ||
                          invoice.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : invoice.paymentStatus === "PARTIALLY_PAID" ||
                              invoice.paymentStatus === "partially_paid"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {invoice.paymentStatus || "PENDING"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          invoice.status === "ISSUED" || invoice.status === "issued"
                            ? "bg-blue-100 text-blue-700"
                            : invoice.status === "CANCELLED" || invoice.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {invoice.status || "DRAFT"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/hospital/invoices/${invoice.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}