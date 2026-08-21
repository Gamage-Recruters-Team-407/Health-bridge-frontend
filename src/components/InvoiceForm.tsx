"use client";

import { FormEvent, useState } from "react";
import invoiceService, {
  InvoiceRequest,
} from "@/services/invoiceService";

interface InvoiceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function InvoiceForm({
  onSuccess,
  onCancel,
}: InvoiceFormProps) {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const [items, setItems] = useState([
    {
      description: "",
      quantity: 1,
      unitPrice: 0,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;

    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setItems(
      items.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const subtotal = items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0
  );

  const grandTotal = subtotal - discount + tax;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    if (!patientId.trim() || !patientName.trim()) {
      setError("Patient ID and patient name are required.");
      return;
    }

    if (
      items.some(
        (item) =>
          !item.description.trim() ||
          item.quantity <= 0 ||
          item.unitPrice < 0
      )
    ) {
      setError("Please enter valid billing items.");
      return;
    }

    setLoading(true);

    try {
      const data: InvoiceRequest = {
        patientId,
        patientName,
        items,
        discount,
        tax,
      };

      await invoiceService.create(data);

      onSuccess?.();

      setPatientId("");
      setPatientName("");
      setDiscount(0);
      setTax(0);

      setItems([
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ]);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to create invoice."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Create Invoice
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Create a new patient invoice.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Patient ID
          </label>

          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="P001"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Patient Name
          </label>

          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Billing Items</h3>

          <button
            type="button"
            onClick={addItem}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-3 rounded-lg border p-4 md:grid-cols-4"
            >
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  updateItem(
                    index,
                    "description",
                    e.target.value
                  )
                }
                className="rounded-lg border px-3 py-2"
              />

              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(
                    index,
                    "quantity",
                    Number(e.target.value)
                  )
                }
                className="rounded-lg border px-3 py-2"
              />

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) =>
                  updateItem(
                    index,
                    "unitPrice",
                    Number(e.target.value)
                  )
                }
                className="rounded-lg border px-3 py-2"
              />

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-lg border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Discount
          </label>

          <input
            type="number"
            min="0"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Tax
          </label>

          <input
            type="number"
            min="0"
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toFixed(2)}</span>
        </div>

        <div className="mt-2 flex justify-between">
          <span>Discount</span>
          <span>- Rs. {discount.toFixed(2)}</span>
        </div>

        <div className="mt-2 flex justify-between">
          <span>Tax</span>
          <span>Rs. {tax.toFixed(2)}</span>
        </div>

        <div className="mt-3 border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>Rs. {grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Invoice"}
        </button>
      </div>
    </form>
  );
}