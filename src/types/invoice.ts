export type InvoiceStatus =
  | "DRAFT"
  | "ISSUED"
  | "CANCELLED";

export type PaymentStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID";

export interface BillingItem {
  id?: string;
  itemCode: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  hospitalId: string;
  subTotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  invoiceDate: string;
}

export interface InvoiceRequest {
  patientId: string;
  patientName: string;
  hospitalId: string;
  discount: number;
  tax: number;
  items: BillingItem[];
}