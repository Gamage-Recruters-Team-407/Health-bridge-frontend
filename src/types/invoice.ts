export type InvoiceStatus = "DRAFT" | "ISSUED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID" | "PENDING";

export interface BillingItem {
  id?: string;
  itemCode?: string;
  description: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber?: string;
  patientId: string;
  patientName: string;
  hospitalId?: string;
  subTotal?: number;
  subtotal?: number;
  discount: number;
  tax: number;
  totalAmount: number;
  grandTotal?: number;
  status: InvoiceStatus | string;
  paymentStatus: PaymentStatus | string;
  invoiceDate?: string;
  createdAt?: string;
  items?: BillingItem[];
}

export interface InvoiceRequest {
  patientId: string;
  patientName: string;
  hospitalId?: string;
  discount: number;
  tax: number;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}