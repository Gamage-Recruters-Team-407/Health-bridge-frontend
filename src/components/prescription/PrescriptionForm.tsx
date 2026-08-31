"use client";

import { useState } from "react";
import MedicineSelector from "./MedicineSelector";

// Mock Medicines (Backend එකෙන් ගන්නවා නම් මේක props එකක් විදියට යවන්න)
const MOCK_MEDICINES = [
  { id: "med1", value: "med1", label: "Lisinopril (Antihypertensive)", interactions: ["Potassium", "Ibuprofen"] },
  { id: "med2", value: "med2", label: "Metformin (Antidiabetic)", interactions: ["Alcohol"] },
  { id: "med3", value: "med3", label: "Ibuprofen (NSAID)", interactions: ["Lisinopril", "Aspirin"] },
  { id: "med4", value: "med4", label: "Amoxicillin (Antibiotic)", interactions: ["Methotrexate"] },
];

interface MedicineItem {
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
}

interface Interaction {
  medicine1: string;
  medicine2: string;
  description: string;
}

interface PrescriptionFormProps {
  initialData?: {
    patientName: string;
    patientPhone: string;
    notes: string;
    items: MedicineItem[];
  };
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export default function PrescriptionForm({ initialData, onSubmit, isSubmitting }: PrescriptionFormProps) {
  const [items, setItems] = useState<MedicineItem[]>(initialData?.items || []);
  const [patientName, setPatientName] = useState(initialData?.patientName || "");
  const [patientPhone, setPatientPhone] = useState(initialData?.patientPhone || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  const [selectedMed, setSelectedMed] = useState("");
  const [selectedMedLabel, setSelectedMedLabel] = useState("");
  const [selectedMedInteractions, setSelectedMedInteractions] = useState<string[]>([]);
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  const checkInteractions = (newInteractions: string[], newName: string) => {
    const found: Interaction[] = [];
    items.forEach((item) => {
      const existingMed = MOCK_MEDICINES.find((m) => m.id === item.medicineId);
      if (existingMed && newInteractions.includes(existingMed.label.split(" ")[0])) {
        found.push({
          medicine1: newName,
          medicine2: existingMed.label.split(" ")[0],
          description: `Potential interaction between ${newName} and ${existingMed.label.split(" ")[0]}.`,
        });
      }
    });
    return found;
  };

  const handleAddMedicine = () => {
    if (!selectedMed || !dosage || !frequency) {
      alert("Please fill medicine, dosage and frequency!");
      return;
    }

    const newInteractions = checkInteractions(selectedMedInteractions, selectedMedLabel);
    if (newInteractions.length > 0) {
      setInteractions((prev) => [...prev, ...newInteractions]);
    }

    setItems([
      ...items,
      { medicineId: selectedMed, medicineName: selectedMedLabel, dosage, frequency, duration, quantity, instructions },
    ]);

    setSelectedMed(""); setSelectedMedLabel(""); setSelectedMedInteractions([]);
    setDosage(""); setFrequency(""); setDuration(""); setQuantity(1); setInstructions("");
  };

  const handleSubmit = () => {
    if (items.length === 0) return alert("Add at least one medicine!");
    if (!patientName || !patientPhone) return alert("Please enter Patient Name and Phone Number!");
    
    onSubmit({ patientName, patientPhone, notes, items });
  };

  return (
    <div className="space-y-5">
      {interactions.length > 0 && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <h2 className="text-sm font-bold text-rose-900">⚠️ Drug Interactions Detected</h2>
          <div className="mt-3 space-y-2">
            {interactions.map((int, idx) => (
              <div key={idx} className="rounded-xl bg-white p-3 border border-rose-100">
                <p className="text-xs font-bold text-slate-800">{int.medicine1} + {int.medicine2}</p>
                <p className="mt-1 text-xs text-slate-600">{int.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
        <section className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">Add Medicine</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold uppercase text-slate-400">Search & Select Medicine</label>
                <div className="mt-1">
                  <MedicineSelector
                    options={MOCK_MEDICINES}
                    value={selectedMed}
                    onChange={(val, label, ints) => {
                      setSelectedMed(val);
                      setSelectedMedLabel(label);
                      setSelectedMedInteractions(ints);
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase text-slate-400">Dosage</label>
                <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g., 500mg" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase text-slate-400">Frequency</label>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-400">
                  <option value="">-- Select --</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase text-slate-400">Duration</label>
                <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 7 days" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase text-slate-400">Quantity</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold uppercase text-slate-400">Instructions</label>
                <input type="text" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="e.g., Take after meals" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-400" />
              </div>
            </div>
            <button onClick={handleAddMedicine} className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700">+ Add Medicine</button>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">Added Medicines ({items.length})</h2>
            {items.length === 0 ? <p className="mt-3 text-xs text-slate-500">No medicines added yet.</p> : (
              <div className="mt-3 space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.medicineName}</p>
                      <p className="text-[10px] text-slate-500">{item.dosage} • {item.frequency} • {item.duration}</p>
                    </div>
                    <button onClick={() => setItems(items.filter((_, i) => i !== index))} className="text-xs font-semibold text-rose-600 hover:text-rose-700">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">Patient Information</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] font-semibold uppercase text-slate-400">Patient Name</label>
                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter patient name" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase text-slate-400">Phone Number</label>
                <input type="tel" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="+94 77 123 4567" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase text-slate-400">Doctor's Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-400" />
              </div>
            </div>
          </section>
          <button onClick={handleSubmit} disabled={isSubmitting} className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
            {isSubmitting ? "Saving..." : "Save Prescription"}
          </button>
        </aside>
      </div>
    </div>
  );
}