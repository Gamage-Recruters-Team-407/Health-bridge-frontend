"use client";

import { useEffect, useState } from "react";
import { invoiceService } from "@/services/invoiceService";
import type { Invoice } from "@/services/invoiceService";

interface InvoiceTableProps {
  onView?: (invoice: Invoice) => void;
  refresh?: number;
}

export default function InvoiceTable({
  onView,
  refresh,
}: InvoiceTableProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await invoiceService.getAll();
      setInvoices(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load invoices."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [refresh]);

  const handleDelete = async (id?: string) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmed) return;

    try {
      await invoiceService.delete(id);
      loadInvoices();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Failed to delete invoice."
      );
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        Loading invoices...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-red-50 p-5 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-4">Invoice</th>
              <th className="px-5 py-4">Patient</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {invoices.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-gray-500"
                >
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium">
                    {invoice.invoiceNumber ||
                      invoice.id}
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-medium">
                      {invoice.patientName}
                    </div>

                    <div className="text-xs text-gray-500">
                      {invoice.patientId}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {invoice.createdAt
                      ? new Date(
                          invoice.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    Rs.{" "}
                    {Number(
                      invoice.grandTotal ?? 0
                    ).toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {invoice.paymentStatus ||
                        invoice.status ||
                        "PENDING"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(invoice)}
                          className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50"
                        >
                          View
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleDelete(invoice.id)
                        }
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}