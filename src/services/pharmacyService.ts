// src/services/pharmacyService.ts

<<<<<<< HEAD
import api from "@/lib/axios";
import type { Medicine, InventoryItem, Delivery } from "@/types/pharmacy";

// ============================================================
// Medicines
// ============================================================

export const getAllMedicines = () =>
    api.get<Medicine[]>("/v1/pharmacy/medicines");

export const searchMedicines = (name: string) =>
    api.get<Medicine[]>(`/v1/pharmacy/medicines?name=${encodeURIComponent(name)}`);

export const getMedicineById = (id: string) =>
    api.get<Medicine>(`/v1/pharmacy/medicines/${id}`);

export const createMedicine = (data: Omit<Medicine, "id">) =>
    api.post<Medicine>("/v1/pharmacy/medicines", data);

export const updateMedicine = (id: string, data: Partial<Omit<Medicine, "id">>) =>
    api.put<Medicine>(`/v1/pharmacy/medicines/${id}`, data);

export const deleteMedicine = (id: string) =>
    api.delete<void>(`/v1/pharmacy/medicines/${id}`);

// ============================================================
// Inventory
// ============================================================

export const getInventoryByPharmacy = (pharmacyId: string) =>
    api.get<InventoryItem[]>(`/v1/pharmacy/inventory/pharmacy/${pharmacyId}`);

export const getInventoryById = (id: string) =>
    api.get<InventoryItem>(`/v1/pharmacy/inventory/${id}`);

export const getLowStockAlerts = (pharmacyId: string) =>
    api.get<InventoryItem[]>(`/v1/pharmacy/inventory/alerts/low-stock?pharmacyId=${pharmacyId}`);

export const addStock = (data: Partial<InventoryItem>) =>
    api.post<InventoryItem>("/v1/pharmacy/inventory", data);

export const updateStock = (id: string, data: Partial<InventoryItem>) =>
    api.put<InventoryItem>(`/v1/pharmacy/inventory/${id}`, data);

export const deleteStock = (id: string) =>
    api.delete<void>(`/v1/pharmacy/inventory/${id}`);

// ============================================================
// Pharmacy branch
// ============================================================

export const getAllActivePharmacies = () =>
    api.get<unknown[]>("/v1/pharmacy/pharmacies");

export const getPharmacyById = (id: string) =>
    api.get<unknown>(`/v1/pharmacy/pharmacies/${id}`);

// ============================================================
// Deliveries
// ============================================================

export const getDeliveriesByPharmacy = (pharmacyId: string) =>
    api.get<Delivery[]>(`/v1/pharmacy/deliveries/pharmacy/${pharmacyId}`);

export const getDeliveryById = (id: string) =>
    api.get<Delivery>(`/v1/pharmacy/deliveries/${id}`);

export const updateDeliveryStatus = (id: string, status: string) =>
    api.patch<Delivery>(`/v1/pharmacy/deliveries/${id}/status`, { status });

export const createDelivery = (data: Partial<Delivery> & { items: unknown[] }) =>
    api.post<Delivery>("/v1/pharmacy/deliveries", data);
=======
import type { Medicine, InventoryItem, Delivery } from "@/types/pharmacy";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8088/api/v1/pharmacy";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(init?.headers ?? {}),
        },
        cache: "no-store",
    });

    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Request failed (${res.status}): ${body || res.statusText}`);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}

// ---------- Medicines ----------
export const getAllMedicines = () => apiFetch<Medicine[]>("/medicines");

export const searchMedicines = (name: string) =>
    apiFetch<Medicine[]>(`/medicines?name=${encodeURIComponent(name)}`);

export const getMedicineById = (id: string) => apiFetch<Medicine>(`/medicines/${id}`);

export const createMedicine = (data: Omit<Medicine, "id">) =>
    apiFetch<Medicine>("/medicines", { method: "POST", body: JSON.stringify(data) });

export const updateMedicine = (id: string, data: Partial<Omit<Medicine, "id">>) =>
    apiFetch<Medicine>(`/medicines/${id}`, { method: "PUT", body: JSON.stringify(data) });

// ---------- Inventory ----------
export const getInventoryByPharmacy = (pharmacyId: string) =>
    apiFetch<InventoryItem[]>(`/inventory/pharmacy/${pharmacyId}`);

export const getLowStockAlerts = (pharmacyId: string) =>
    apiFetch<InventoryItem[]>(`/inventory/alerts/low-stock?pharmacyId=${pharmacyId}`);

export const addStock = (data: Partial<InventoryItem>) =>
    apiFetch<InventoryItem>("/inventory", { method: "POST", body: JSON.stringify(data) });

// ---------- Deliveries ----------
export const getDeliveriesByPharmacy = (pharmacyId: string) =>
    apiFetch<Delivery[]>(`/deliveries/pharmacy/${pharmacyId}`);

export const getDeliveryById = (id: string) => apiFetch<Delivery>(`/deliveries/${id}`);

export const updateDeliveryStatus = (id: string, status: string) =>
    apiFetch<Delivery>(`/deliveries/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });

export const createDelivery = (data: Partial<Delivery> & { items: unknown[] }) =>
    apiFetch<Delivery>("/deliveries", { method: "POST", body: JSON.stringify(data) });
>>>>>>> 86968a85e262a531503ab17e9f003d686fa4e5e1
