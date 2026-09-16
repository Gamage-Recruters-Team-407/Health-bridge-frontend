// ==================== INVOICE TYPES ====================

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  hospitalId: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  balance: number;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';
  notes?: string;
}

export interface InvoiceRequest {
  patientId: string;
  patientName: string;
  hospitalId: string;
  issueDate?: string;
  dueDate?: string;
  discount?: number;
  tax?: number;
  paidAmount?: number;
  notes?: string;
}

// ==================== BILLING ITEM TYPES ====================

export interface BillingItem {
  id: string;
  invoiceId: string;
  patientId: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface BillingItemRequest {
  invoiceId: string;
  patientId: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

// ==================== INVENTORY TYPES ====================

export interface HospitalInventory {
  id: string;
  hospitalId: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  supplier: string;
  expiryDate: string;
  unitCost: number;
  location: string;
  lowStock: boolean;
}

export interface HospitalInventoryRequest {
  hospitalId: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  supplier: string;
  expiryDate: string;
  unitCost: number;
  location: string;
}

// ==================== COMPLIANCE REPORT TYPES ====================

export interface ComplianceReport {
  id: string;
  hospitalId: string;
  reportType: string;
  period: string;
  status: string;
  summary: string;
  preparedBy: string;
  reportDate: string;
  createdAt: string;
}

export interface ComplianceReportRequest {
  hospitalId: string;
  reportType: string;
  period: string;
  status: string;
  summary: string;
  preparedBy: string;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}