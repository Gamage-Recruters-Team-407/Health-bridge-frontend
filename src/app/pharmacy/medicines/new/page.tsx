import MedicineForm from "@/components/pharmacy/MedicineForm";

export default function AddMedicinePage() {
    return (
        <div>
            <h1 className="mb-1 text-2xl font-semibold text-slate-900">Add/Edit Medicine</h1>
            <p className="mb-6 text-sm text-slate-500">Create, update, and manage medicine records</p>
            <MedicineForm mode="add" />
        </div>
    );
}