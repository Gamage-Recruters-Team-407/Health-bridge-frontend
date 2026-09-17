"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMedicine, updateMedicine, addStock } from "@/services/pharmacyService";
import type { Medicine, InventoryItem } from "@/types/pharmacy";

const CURRENT_PHARMACY_ID = "REPLACE_WITH_LOGGED_IN_PHARMACY_ID";

interface MedicineFormProps {
    mode: "add" | "edit";
    initialMedicine?: Medicine;
}

export default function MedicineForm({ mode, initialMedicine }: MedicineFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState(initialMedicine?.name ?? "");
    const [genericName, setGenericName] = useState(initialMedicine?.genericName ?? "");
    const [brand, setBrand] = useState(initialMedicine?.brand ?? "");
    const [medicineCode, setMedicineCode] = useState(initialMedicine?.medicineCode ?? "");
    const [category, setCategory] = useState(initialMedicine?.category ?? "");
    const [dosageForm, setDosageForm] = useState(initialMedicine?.dosageForm ?? "");
    const [strength, setStrength] = useState(initialMedicine?.strength ?? "");
    const [manufacturer, setManufacturer] = useState(initialMedicine?.manufacturer ?? "");
    const [prescriptionRequired, setPrescriptionRequired] = useState(initialMedicine?.prescriptionRequired ?? false);
    const [controlledDrug, setControlledDrug] = useState(initialMedicine?.controlledDrug ?? false);
    const [unitPrice, setUnitPrice] = useState(String(initialMedicine?.unitPrice ?? ""));

    // ---- Inventory batch fields (real, only used on "add", separate API call) ----
    const [batchNumber, setBatchNumber] = useState("");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [currentStock, setCurrentStock] = useState("");
    const [reorderLevel, setReorderLevel] = useState("");
    const [supplier, setSupplier] = useState("");
    const [manufactureDate, setManufactureDate] = useState("");
    const [expiryDate, setExpiryDate] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            const payload: Partial<Omit<Medicine, "id">> = {
                name,
                genericName,
                brand,
                medicineCode,
                category,
                dosageForm,
                strength,
                manufacturer,
                prescriptionRequired,
                controlledDrug,
                unitPrice: Number(unitPrice) || 0,
            };

            let medicineId = initialMedicine?.id;

            if (mode === "edit" && medicineId) {
                await updateMedicine(medicineId, payload);
            } else {
                const created = await createMedicine(payload as Omit<Medicine, "id">);
                medicineId = created.id;
            }

            // Only create an inventory batch on "add" mode, and only if batch info was filled in
            if (mode === "add" && medicineId && batchNumber && currentStock) {
                await addStock({
                    pharmacyId: CURRENT_PHARMACY_ID,
                    medicineId,
                    itemCode: medicineCode,
                    itemName: name,
                    batchNumber,
                    supplier,
                    quantity: Number(currentStock) || 0,
                    minimumStock: Number(reorderLevel) || 0,
                    unitCost: Number(purchasePrice) || 0,
                    sellingPrice: Number(sellingPrice) || 0,
                    manufactureDate: manufactureDate || undefined,
                    expiryDate: expiryDate || undefined,
                } as Partial<InventoryItem>);
            }

            router.push("/pharmacy/inventory");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save medicine");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!initialMedicine || !confirm(`Delete ${initialMedicine.name}? This can't be undone.`)) return;
        // TODO: wire to deleteMedicine(id) once confirmed with backend team
        alert("Delete endpoint not wired yet.");
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Tabs */}
            <div className="mb-4 flex gap-6 border-b border-slate-200 text-sm font-medium">
                <button
                    type="button"
                    onClick={() => router.push("/pharmacy/medicines/new")}
                    className={`border-b-2 pb-2 ${mode === "add" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-400"}`}
                >
                    Add Medicine
                </button>
                <span className={`border-b-2 pb-2 ${mode === "edit" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-300"}`}>
          Edit Medicine
        </span>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Medicine Details */}
                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold text-slate-900">Medicine Details</h2>
                        <p className="mb-4 text-xs text-slate-400">Basic identification and descriptive information</p>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <TextField label="Medicine Name" required value={name} onChange={setName} />
                            <TextField label="Generic Name" required value={genericName} onChange={setGenericName} />
                            <TextField label="Brand Name" required value={brand} onChange={setBrand} />
                            <TextField label="Medicine ID / SKU" required value={medicineCode} onChange={setMedicineCode} />
                            <TextField label="Category" required value={category} onChange={setCategory} />
                            <TextField label="Dosage Form" required value={dosageForm} onChange={setDosageForm} />
                            <TextField label="Strength" required value={strength} onChange={setStrength} placeholder="e.g. 500mg" />
                            <TextField label="Manufacturer" required value={manufacturer} onChange={setManufacturer} />
                            <TextField label="Unit Price (USD)" required value={unitPrice} onChange={setUnitPrice} type="number" />
                        </div>

                        <div className="mt-4">
                            <label className="mb-1 block text-xs font-medium text-slate-500">Description</label>
                            <textarea
                                disabled
                                placeholder="Not saved — no backend field for this yet"
                                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
                                rows={2}
                            />
                        </div>
                    </section>

                    {/* Inventory & Pricing */}
                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold text-slate-900">Inventory &amp; Pricing</h2>
                        <p className="mb-4 text-xs text-slate-400">
                            Stock levels, pricing, and supplier information
                            {mode === "edit" && (
                                <span className="ml-2 font-medium text-amber-600">
                  — editing an existing batch isn&apos;t wired yet; use Inventory page to adjust stock.
                </span>
                            )}
                        </p>

                        <fieldset disabled={mode === "edit"} className={mode === "edit" ? "opacity-50" : ""}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                <TextField label="Batch Number" required value={batchNumber} onChange={setBatchNumber} />
                                <TextField label="Purchase Price (USD)" required value={purchasePrice} onChange={setPurchasePrice} type="number" />
                                <TextField label="Selling Price (USD)" required value={sellingPrice} onChange={setSellingPrice} type="number" />
                                <TextField label="Current Stock" required value={currentStock} onChange={setCurrentStock} type="number" />
                                <TextField label="Reorder Level" required value={reorderLevel} onChange={setReorderLevel} type="number" />
                                <TextField label="Supplier" required value={supplier} onChange={setSupplier} />
                            </div>
                        </fieldset>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 opacity-50">
                            <TextField label="Storage Location" value="" onChange={() => {}} disabled placeholder="Not saved yet" />
                            <TextField label="Barcode" value="" onChange={() => {}} disabled placeholder="Not saved yet" />
                        </div>
                    </section>

                    {/* Expiry & Batch Information */}
                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold text-slate-900">Expiry &amp; Batch Information</h2>
                        <p className="mb-4 text-xs text-slate-400">Manufacture, expiry, and shelf-life details</p>

                        <fieldset disabled={mode === "edit"} className={mode === "edit" ? "opacity-50" : ""}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                <TextField label="Manufacture Date" required value={manufactureDate} onChange={setManufactureDate} type="date" />
                                <TextField label="Expiry Date" required value={expiryDate} onChange={setExpiryDate} type="date" />
                                <TextField label="Shelf Life" value="" onChange={() => {}} disabled placeholder="Not saved yet" />
                                <TextField label="Auto Expiry Alert (days)" value="" onChange={() => {}} disabled placeholder="Not saved yet" />
                            </div>
                        </fieldset>
                    </section>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => router.back()} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                            Reset
                        </button>
                        {mode === "edit" && (
                            <button type="button" onClick={handleDelete} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                                🗑 Delete Medicine
                            </button>
                        )}
                        <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                            {saving ? "Saving…" : mode === "edit" ? "✓ Update Medicine" : "✓ Add Medicine"}
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Safety & Controls */}
                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold text-slate-900">Safety &amp; Controls</h2>
                        <p className="mb-4 text-xs text-slate-400">Regulatory and handling settings</p>

                        <div className="space-y-3">
                            <ToggleRow label="Active Status" checked disabled note="Not saved yet" />
                            <ToggleRow label="Prescription Required" checked={prescriptionRequired} onChange={setPrescriptionRequired} />
                            <ToggleRow label="Controlled Substance" checked={controlledDrug} onChange={setControlledDrug} />
                            <ToggleRow label="Taxable Item" checked disabled note="Not saved yet" />
                            <ToggleRow label="Cold Storage" checked={false} disabled note="Not saved yet" />
                            <ToggleRow label="Low Stock Alerts" checked disabled note="Not saved yet" />
                        </div>
                    </section>

                    {/* Medicine Preview */}
                    <section className="rounded-xl bg-white p-5 text-center shadow-sm">
                        <h2 className="mb-1 text-left text-base font-semibold text-slate-900">Medicine Preview</h2>
                        <p className="mb-3 text-left text-xs text-slate-400">Package image or label preview</p>
                        <div className="rounded-lg border-2 border-dashed border-slate-200 p-6">
                            <p className="mb-2 text-2xl" aria-hidden>📦</p>
                            <p className="mb-1 text-sm text-slate-400">No image uploaded</p>
                            <p className="mb-3 text-xs text-slate-300">PNG, JPG up to 2MB</p>
                            <button type="button" disabled className="cursor-not-allowed rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-300">
                                ⬆ Upload Image
                            </button>
                            <p className="mt-2 text-[11px] text-amber-600">Image upload isn&apos;t supported by the backend yet.</p>
                        </div>
                    </section>

                    {mode === "edit" && (
                        <section className="rounded-xl bg-white p-5 shadow-sm">
                            <h2 className="text-base font-semibold text-slate-900">Audit &amp; Notes</h2>
                            <p className="mb-4 text-xs text-slate-400">Record tracking and internal notes</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-slate-400">Last Updated By</p>
                                    <p className="text-slate-300">Not tracked yet</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Last Modified</p>
                                    <p className="text-slate-300">Not tracked yet</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="mb-1 block text-xs font-medium text-slate-500">Internal Notes</label>
                                <textarea disabled placeholder="Not saved yet" className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400" rows={2} />
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </form>
    );
}

function TextField({
                       label,
                       value,
                       onChange,
                       required,
                       type = "text",
                       placeholder,
                       disabled,
                   }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    required?: boolean;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
}) {
    return (
        <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                required={required}
                disabled={disabled}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 ${
                    disabled ? "cursor-not-allowed bg-slate-50 text-slate-400" : ""
                }`}
            />
        </div>
    );
}

function ToggleRow({
                       label,
                       checked,
                       onChange,
                       disabled,
                       note,
                   }: {
    label: string;
    checked: boolean;
    onChange?: (v: boolean) => void;
    disabled?: boolean;
    note?: string;
}) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-700">{label}</p>
                {note && <p className="text-xs text-slate-400">{note}</p>}
            </div>
            <button
                type="button"
                disabled={disabled}
                onClick={() => onChange?.(!checked)}
                className={`h-5 w-9 rounded-full transition ${checked ? "bg-blue-600" : "bg-slate-200"} ${
                    disabled ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-pressed={checked}
            >
                <span className={`block h-4 w-4 translate-x-0.5 rounded-full bg-white transition ${checked ? "translate-x-4" : ""}`} />
            </button>
        </div>
    );
}