"use client";

import { useEffect, useState } from "react";
import invoiceService, {
  Invoice,
} from "@/services/invoiceService";

interface BillingStatsProps {
  refresh?: number;
}

export default function BillingStats({
  refresh,
}: BillingStatsProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await invoiceService.getAll();
        setInvoices(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [refresh]);

  const totalInvoices = invoices.length;

  const totalRevenue = invoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.grandTotal ?? 0),
    0
  );

  const paidInvoices = invoices.filter(
    (invoice) =>
      invoice.paymentStatus === "PAID"
  ).length;

  const pendingInvoices = invoices.filter(
    (invoice) =>
      invoice.paymentStatus !== "PAID"
  ).length;

  const stats = [
    {
      title: "Total Invoices",
      value: totalInvoices,
      description: "All generated invoices",
    },
    {
      title: "Total Revenue",
      value: `Rs. ${totalRevenue.toFixed(2)}`,
      description: "Invoice total",
    },
    {
      title: "Paid Invoices",
      value: paidInvoices,
      description: "Successfully paid",
    },
    {
      title: "Pending",
      value: pendingInvoices,
      description: "Awaiting payment",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-gray-500">
            {stat.title}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {stat.value}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}