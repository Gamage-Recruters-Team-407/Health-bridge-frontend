
"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
  useCallback,
} from "react";

import { useBillingStore } from "@/hooks/useBilling";
import { useInventory } from "@/hooks/useInventory";
import { useCompliance } from "@/hooks/useCompliance";

import {
  Invoice,
  InvoiceRequest,
  BillingItem,
  BillingItemRequest,
  HospitalInventory,
  HospitalInventoryRequest,
  ComplianceReport,
  ComplianceReportRequest,
} from "@/types/hospital";

// ============================================================
// Types
// ============================================================

interface HospitalContextType {
  // ==========================================================
  // Invoices
  // ==========================================================

  invoices: Invoice[];
  invoicesLoading: boolean;
  invoicesError: string | null;

  fetchAllInvoices: () => Promise<void>;
  createInvoice: (data: InvoiceRequest) => Promise<Invoice>;
  updateInvoice: (
    id: string,
    data: InvoiceRequest
  ) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<void>;

  // ==========================================================
  // Billing Items
  // ==========================================================

  billingItems: BillingItem[];
  billingItemsLoading: boolean;
  billingItemsError: string | null;

  createBillingItem: (
    data: BillingItemRequest
  ) => Promise<BillingItem>;

  updateBillingItem: (
    id: string,
    data: BillingItemRequest
  ) => Promise<BillingItem>;

  deleteBillingItem: (
    id: string
  ) => Promise<void>;

  // ==========================================================
  // Inventory
  // ==========================================================

  inventory: HospitalInventory[];
  lowStockItems: HospitalInventory[];

  inventoryLoading: boolean;
  inventoryError: string | null;

  createInventoryItem: (
    data: HospitalInventoryRequest
  ) => Promise<HospitalInventory>;

  updateInventoryItem: (
    id: string,
    data: HospitalInventoryRequest
  ) => Promise<HospitalInventory>;

  deleteInventoryItem: (
    id: string
  ) => Promise<void>;

  // ==========================================================
  // Compliance
  // ==========================================================

  complianceReports: ComplianceReport[];

  complianceLoading: boolean;
  complianceError: string | null;

  createComplianceReport: (
    data: ComplianceReportRequest
  ) => Promise<ComplianceReport>;

  updateComplianceReport: (
    id: string,
    data: ComplianceReportRequest
  ) => Promise<ComplianceReport>;

  deleteComplianceReport: (
    id: string
  ) => Promise<void>;
}

// ============================================================
// Context
// ============================================================

const HospitalContext =
  createContext<HospitalContextType | undefined>(undefined);

// ============================================================
// Provider
// ============================================================

export const HospitalProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  // ==========================================================
  // Billing Store
  // ==========================================================

  const billingData = useBillingStore();

  // ==========================================================
  // Inventory
  // ==========================================================

  const inventoryData = useInventory();

  // ==========================================================
  // Compliance
  // ==========================================================

  const complianceData = useCompliance();

  // ==========================================================
  // Debug Logging
  // ==========================================================

  useEffect(() => {
    console.log(
      "📊 HospitalProvider - Invoices State:",
      {
        count: billingData.invoices?.length || 0,
        loading: billingData.loading,
        error: billingData.error,
      }
    );
  }, [
    billingData.invoices,
    billingData.loading,
    billingData.error,
  ]);

  // ==========================================================
  // Invoice Fetch
  // ==========================================================

  const fetchAllInvoices = useCallback(async (): Promise<void> => {
    await billingData.refreshData();
  }, [billingData.refreshData]);

  // ==========================================================
  // Context Value
  // ==========================================================

  const value = useMemo<HospitalContextType>(
    () => ({
      // ======================================================
      // Invoices
      // ======================================================

      invoices: billingData.invoices || [],

      invoicesLoading: billingData.loading,

      invoicesError: billingData.error,

      fetchAllInvoices,

      // ======================================================
      // Invoice CRUD
      // ======================================================
      //
      // Your current useBilling.ts only provides:
      //
      // - invoices
      // - loading
      // - error
      // - refreshData
      //
      // Therefore these three methods cannot be connected
      // until create/update/delete methods are exposed
      // from your billing service/store.
      //
      // ======================================================

      createInvoice: async (
        _data: InvoiceRequest
      ): Promise<Invoice> => {
        throw new Error(
          "createInvoice is not implemented in useBilling.ts"
        );
      },

      updateInvoice: async (
        _id: string,
        _data: InvoiceRequest
      ): Promise<Invoice> => {
        throw new Error(
          "updateInvoice is not implemented in useBilling.ts"
        );
      },

      deleteInvoice: async (
        _id: string
      ): Promise<void> => {
        throw new Error(
          "deleteInvoice is not implemented in useBilling.ts"
        );
      },

      // ======================================================
      // Billing Items
      // ======================================================
      //
      // Current useBilling.ts does NOT export useBillingItems.
      // Therefore no fake billing-item data is generated here.
      //
      // ======================================================

      billingItems: [],

      billingItemsLoading: false,

      billingItemsError:
        "Billing Items hook is not implemented in useBilling.ts",

      createBillingItem: async (
        _data: BillingItemRequest
      ): Promise<BillingItem> => {
        throw new Error(
          "createBillingItem is not implemented in useBilling.ts"
        );
      },

      updateBillingItem: async (
        _id: string,
        _data: BillingItemRequest
      ): Promise<BillingItem> => {
        throw new Error(
          "updateBillingItem is not implemented in useBilling.ts"
        );
      },

      deleteBillingItem: async (
        _id: string
      ): Promise<void> => {
        throw new Error(
          "deleteBillingItem is not implemented in useBilling.ts"
        );
      },

      // ======================================================
      // Inventory
      // ======================================================

      inventory:
        inventoryData.inventory || [],

      lowStockItems:
        inventoryData.lowStockItems || [],

      inventoryLoading:
        inventoryData.loading,

      inventoryError:
        inventoryData.error,

      createInventoryItem:
        inventoryData.createInventoryItem,

      updateInventoryItem:
        inventoryData.updateInventoryItem,

      deleteInventoryItem:
        inventoryData.deleteInventoryItem,

      // ======================================================
      // Compliance
      // ======================================================

      complianceReports:
        complianceData.reports || [],

      complianceLoading:
        complianceData.loading,

      complianceError:
        complianceData.error,

      createComplianceReport:
        complianceData.createReport,

      updateComplianceReport:
        complianceData.updateReport,

      deleteComplianceReport:
        complianceData.deleteReport,
    }),
    [
      // ======================================================
      // Billing
      // ======================================================

      billingData.invoices,
      billingData.loading,
      billingData.error,
      fetchAllInvoices,

      // ======================================================
      // Inventory
      // ======================================================

      inventoryData.inventory,
      inventoryData.lowStockItems,
      inventoryData.loading,
      inventoryData.error,
      inventoryData.createInventoryItem,
      inventoryData.updateInventoryItem,
      inventoryData.deleteInventoryItem,

      // ======================================================
      // Compliance
      // ======================================================

      complianceData.reports,
      complianceData.loading,
      complianceData.error,
      complianceData.createReport,
      complianceData.updateReport,
      complianceData.deleteReport,
    ]
  );

  // ==========================================================
  // Provider
  // ==========================================================

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

// ============================================================
// useHospital Hook
// ============================================================

export const useHospital = (): HospitalContextType => {
  const context = useContext(HospitalContext);

  if (context === undefined) {
    throw new Error(
      "useHospital must be used within a HospitalProvider"
    );
  }

  return context;
};