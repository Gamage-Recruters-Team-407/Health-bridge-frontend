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

export const createDelivery = (data: Partial<Delivery> & { items: unknown[] }) =>
    apiFetch<Delivery>("/deliveries", { method: "POST", body: JSON.stringify(data) });