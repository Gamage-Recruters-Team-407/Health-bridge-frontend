"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { invoiceService } from "@/services/invoiceService";
import { Invoice } from "@/types/invoice";

export default function BillingPage() {

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadInvoices();

  }, []);

  async function loadInvoices() {

    try {

      const data =
        await invoiceService.getAll();

      setInvoices(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  }

  const totalRevenue =
    invoices.reduce(
      (sum, invoice) =>
        sum + invoice.totalAmount,
      0
    );

  const paidInvoices =
    invoices.filter(
      invoice =>
        invoice.paymentStatus === "PAID"
    ).length;

  const unpaidInvoices =
    invoices.filter(
      invoice =>
        invoice.paymentStatus === "UNPAID"
    ).length;

  return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            Hospital Billing
          </h1>

          <p className="text-gray-500">
            Manage hospital invoices and billing
          </p>
        </div>

        <Link
          href="/hospital/billing/create"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          + Create Invoice
        </Link>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="p-5 rounded-xl border bg-white">
          <p className="text-gray-500">
            Total Revenue
          </p>

          <h2 className="text-2xl font-bold">
            Rs. {totalRevenue.toFixed(2)}
          </h2>
        </div>

        <div className="p-5 rounded-xl border bg-white">
          <p className="text-gray-500">
            Paid Invoices
          </p>

          <h2 className="text-2xl font-bold">
            {paidInvoices}
          </h2>
        </div>

        <div className="p-5 rounded-xl border bg-white">
          <p className="text-gray-500">
            Unpaid Invoices
          </p>

          <h2 className="text-2xl font-bold">
            {unpaidInvoices}
          </h2>
        </div>

      </div>

      <div className="rounded-xl border bg-white overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">
                Invoice
              </th>

              <th className="p-3 text-left">
                Patient
              </th>

              <th className="p-3 text-left">
                Amount
              </th>

              <th className="p-3 text-left">
                Payment
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3">
                Action
              </th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center"
                >
                  Loading...
                </td>
              </tr>

            ) : invoices.length === 0 ? (

              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center"
                >
                  No invoices found
                </td>
              </tr>

            ) : (

              invoices.map(invoice => (

                <tr
                  key={invoice.id}
                  className="border-t"
                >

                  <td className="p-3">
                    {invoice.invoiceNumber}
                  </td>

                  <td className="p-3">
                    {invoice.patientName}
                  </td>

                  <td className="p-3">
                    Rs. {invoice.totalAmount.toFixed(2)}
                  </td>

                  <td className="p-3">
                    {invoice.paymentStatus}
                  </td>

                  <td className="p-3">
                    {invoice.status}
                  </td>

                  <td className="p-3">

                    <Link
                      href={`/hospital/invoices/${invoice.id}`}
                      className="text-blue-600"
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
  );
}