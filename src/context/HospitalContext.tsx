'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useInvoices, useBillingItems } from '@/hooks/useBilling';
import { useInventory } from '@/hooks/useInventory';
import { useCompliance } from '@/hooks/useCompliance';
import {
  Invoice,
  InvoiceRequest,
  BillingItem,
  BillingItemRequest,
  HospitalInventory,
  HospitalInventoryRequest,
  ComplianceReport,
  ComplianceReportRequest,
} from '@/types/hospital';

interface HospitalContextType {
  // Invoices
  invoices: Invoice[];
  invoicesLoading: boolean;
  invoicesError: string | null;
  createInvoice: (data: InvoiceRequest) => Promise<Invoice>;
  updateInvoice: (id: string, data: InvoiceRequest) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<void>;
  
  // Billing Items
  billingItems: BillingItem[];
  billingItemsLoading: boolean;
  billingItemsError: string | null;
  createBillingItem: (data: BillingItemRequest) => Promise<BillingItem>;
  updateBillingItem: (id: string, data: BillingItemRequest) => Promise<BillingItem>;
  deleteBillingItem: (id: string) => Promise<void>;
  
  // Inventory
  inventory: HospitalInventory[];
  lowStockItems: HospitalInventory[];
  inventoryLoading: boolean;
  inventoryError: string | null;
  createInventoryItem: (data: HospitalInventoryRequest) => Promise<HospitalInventory>;
  updateInventoryItem: (id: string, data: HospitalInventoryRequest) => Promise<HospitalInventory>;
  deleteInventoryItem: (id: string) => Promise<void>;
  
  // Compliance
  complianceReports: ComplianceReport[];
  complianceLoading: boolean;
  complianceError: string | null;
  createComplianceReport: (data: ComplianceReportRequest) => Promise<ComplianceReport>;
  updateComplianceReport: (id: string, data: ComplianceReportRequest) => Promise<ComplianceReport>;
  deleteComplianceReport: (id: string) => Promise<void>;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    invoices,
    loading: invoicesLoading,
    error: invoicesError,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  } = useInvoices();

  const {
    items: billingItems,
    loading: billingItemsLoading,
    error: billingItemsError,
    createItem: createBillingItem,
    updateItem: updateBillingItem,
    deleteItem: deleteBillingItem,
  } = useBillingItems();

  const {
    inventory,
    lowStockItems,
    loading: inventoryLoading,
    error: inventoryError,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  } = useInventory();

  const {
    reports: complianceReports,
    loading: complianceLoading,
    error: complianceError,
    createReport: createComplianceReport,
    updateReport: updateComplianceReport,
    deleteReport: deleteComplianceReport,
  } = useCompliance();

  const value: HospitalContextType = {
    invoices,
    invoicesLoading,
    invoicesError,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    billingItems,
    billingItemsLoading,
    billingItemsError,
    createBillingItem,
    updateBillingItem,
    deleteBillingItem,
    inventory,
    lowStockItems,
    inventoryLoading,
    inventoryError,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    complianceReports,
    complianceLoading,
    complianceError,
    createComplianceReport,
    updateComplianceReport,
    deleteComplianceReport,
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = (): HospitalContextType => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};