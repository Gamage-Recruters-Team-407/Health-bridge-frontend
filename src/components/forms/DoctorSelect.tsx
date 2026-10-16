"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, X, Loader2, UserCheck } from "lucide-react";
import axios from "axios";

interface Doctor {
  id?: string;
  _id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  specialization?: string;
  department?: string;
}

interface DoctorSelectProps {
  value: string;
  onChange: (doctorId: string, doctorName: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const FALLBACK_DOCTORS: Doctor[] = [
  { id: "DOC-001", name: "Dr. Sarah Perera", specialization: "Cardiology", email: "sarah@healthbridge.lk" },
  { id: "DOC-002", name: "Dr. Kumara Silva", specialization: "General Medicine", email: "kumara@healthbridge.lk" },
  { id: "DOC-003", name: "Dr. Ananya Fernando", specialization: "Pediatrics", email: "ananya@healthbridge.lk" },
  { id: "DOC-004", name: "Dr. Nuwan Jayasinghe", specialization: "Neurology", email: "nuwan@healthbridge.lk" }
];

export const DoctorSelect: React.FC<DoctorSelectProps> = ({
  value,
  onChange,
  placeholder = "Search doctor...",
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>(FALLBACK_DOCTORS);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return doctors.slice(0, 10);
    }
    const lower = query.toLowerCase();
    return doctors
      .filter((d) => {
        const docName = (d.name || d.fullName || "").toLowerCase();
        const docSpec = (d.specialization || d.department || "").toLowerCase();
        return docName.includes(lower) || docSpec.includes(lower);
      })
      .slice(0, 10);
  }, [query, doctors]);

  const selected = useMemo(() => {
    if (!value || doctors.length === 0) return null;
    return (
      doctors.find(
        (d) =>
          d.id === value ||
          d._id === value ||
          d.name === value ||
          d.fullName === value
      ) ?? null
    );
  }, [value, doctors]);

  useEffect(() => {
    let cancelled = false;

    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:8088/api/doctors");
        if (!cancelled && res.data) {
          const dataArray = Array.isArray(res.data) ? res.data : res.data.content || [];
          if (dataArray.length > 0) {
            setDoctors(dataArray);
          }
        }
      } catch (err) {
        console.error("Failed to load doctors, using fallback:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDoctors();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = useCallback(
    (doctor: Doctor) => {
      const docName = doctor.name || doctor.fullName || "Doctor";
      const docId = doctor.id || doctor._id || docName;
      onChange(docId, docName);
      setIsOpen(false);
      setQuery("");
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange("", "");
    setQuery("");
  }, [onChange]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Prepared By (Doctor) {required && <span className="text-red-500">*</span>}
      </label>

      {selected ? (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-blue-300 bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {selected.name || selected.fullName}
              </p>
              <p className="text-xs text-slate-500">
                {selected.specialization || selected.department || "General Medicine"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          disabled={disabled}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-white text-left text-sm text-slate-500 disabled:opacity-50 transition"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{value || placeholder}</span>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-xl bg-white border border-slate-200 shadow-2xl max-h-72 overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctor by name or specialization..."
              autoFocus
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white text-sm outline-none transition"
            />
          </div>

          <div className="max-h-56 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-600" />
                <p className="text-xs text-slate-500 mt-2">Loading doctors...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-xs text-slate-500">No doctors found</p>
              </div>
            ) : (
              filtered.map((d, index) => {
                const docName = d.name || d.fullName || "Doctor";
                const docSpec = d.specialization || d.department || "General Medicine";
                return (
                  <button
                    key={d.id || d._id || index}
                    type="button"
                    onClick={() => handleSelect(d)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 transition text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {docName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {docSpec} {d.email ? `- ${d.email}` : ""}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSelect;