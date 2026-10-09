"use client";
import Select from "react-select";
import { MedicineOption } from "@/services/prescriptionService";

interface MedicineSelectorProps {
  options: MedicineOption[];
  value: string | null;
  onChange: (value: string, label: string, interactions: string[]) => void;
  isLoading?: boolean;
}

export default function MedicineSelector({ options, value, onChange, isLoading }: MedicineSelectorProps) {
  return (
    <Select
      options={options}
      value={options.find((opt) => opt.value === value) || null}
      onChange={(selectedOption) => {
        if (selectedOption) onChange(selectedOption.value, selectedOption.label, selectedOption.interactions);
        else onChange("", "", []);
      }}
      placeholder="Search medicine by name..."
      noOptionsMessage={() => "No medicines found"}
      isClearable
      isLoading={isLoading}
      classNames={{
        control: (state) =>
          `cursor-pointer ${state.isFocused ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200"}`,
        input: () => "text-sm cursor-text",
        option: (state) =>
          `cursor-pointer ${state.isFocused ? "bg-blue-50 text-blue-700" : "text-slate-700"}`,
        dropdownIndicator: () => "cursor-pointer",
        clearIndicator: () => "cursor-pointer",
      }}
    />
  );
}