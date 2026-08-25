"use client";

import { Invoice } from "@/types/invoice";

interface InvoiceDetailsProps {
  invoice: Invoice | null;
  onClose?: () => void;
}

export default function InvoiceDetails({
  invoice,
  onClose,
}: InvoiceDetailsProps) {
  if (!invoice) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        Select an invoice to view details.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between border-b pb-5">
        <div>
          <h2 className="text-xl font-bold">
            Invoice Details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Invoice #{invoice.invoiceNumber || invoice.id}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg border px-3 py-1.5 text-sm"
          >
            Close
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 py-5 md:grid-cols-2">
        <div>
          <p className="text-xs text-gray-500">Patient ID</p>
          <p className="font-medium">{invoice.patientId}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Patient Name</p>
          <p className="font-medium">{invoice.patientName}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Invoice Date</p>
          <p className="font-medium">
            {invoice.createdAt
              ? new Date(
                  invoice.createdAt
                ).toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Payment Status</p>
          <p className="font-medium">
            {invoice.paymentStatus ||
              invoice.status ||
              "PENDING"}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Unit Price</th>
              <th className="px-4 py-3 text-right">
                Total
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {invoice.items?.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3">
                  {item.description}
                </td>

                <td className="px-4 py-3">
                  {item.quantity}
                </td>

                <td className="px-4 py-3">
                  Rs.{" "}
                  {Number(item.unitPrice).toFixed(2)}
                </td>

                <td className="px-4 py-3 text-right">
                  Rs.{" "}
                  {(
                    item.quantity * item.unitPrice
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ml-auto mt-6 max-w-sm space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            Rs.{" "}
            {Number(invoice.subtotal ?? 0).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Discount</span>
          <span>
            - Rs.{" "}
            {Number(invoice.discount ?? 0).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>
            Rs. {Number(invoice.tax ?? 0).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between border-t pt-3 text-lg font-bold">
          <span>Grand Total</span>
          <span>
            Rs.{" "}
            {Number(invoice.grandTotal ?? 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}