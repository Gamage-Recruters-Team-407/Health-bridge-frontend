"use client";

import Select from "react-select";

interface MedicineOption {
  value: string;
  label: string;
  interactions: string[];
}

interface MedicineSelectorProps {
  options: MedicineOption[];
  value: string | null;
  onChange: (value: string, label: string, interactions: string[]) => void;
}

export default function MedicineSelector({ options, value, onChange }: MedicineSelectorProps) {
  return (
    <Select
      options={options}
      value={options.find((opt) => opt.value === value) || null}
      onChange={(selectedOption) => {
        if (selectedOption) {
          onChange(selectedOption.value, selectedOption.label, selectedOption.interactions);
        } else {
          onChange("", "", []);
        }
      }}
      placeholder="Type to search medicine..."
      isClearable
      className="text-xs"
    />
  );
}