"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, X, Loader2, UserCheck } from "lucide-react";
import { apiClient } from "@/services/apiClient";

interface Doctor {
  id?: string;
  _id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  specialization?: string;
  department?: string;
  role?: string;
  phoneNumber?: string;
}

interface DoctorSelectProps {
  value: string;
  onChange: (doctorId: string, doctorName: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const DoctorSelect: React.FC<DoctorSelectProps> = ({
  value,
  onChange,
  placeholder = "Search doctor...",
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Filter doctors based on search query
  const filtered = useMemo(() => {
    if (!query.trim()) {
      return doctors.slice(0, 10);
    }
    const lower = query.toLowerCase();
    return doctors
      .filter((d) => {
        const docName = (d.name || d.fullName || "").toLowerCase();
        const docSpec = (d.specialization || d.department || "").toLowerCase();
        const docEmail = (d.email || "").toLowerCase();
        return (
          docName.includes(lower) ||
          docSpec.includes(lower) ||
          docEmail.includes(lower)
        );
      })
      .slice(0, 10);
  }, [query, doctors]);

  // ✅ Get currently selected doctor
  const selected = useMemo(() => {
    if (!value || doctors.length === 0) return null;
    return (
      doctors.find(
        (d) =>
          d.id === value ||
          d._id === value ||
          d.name === value ||
          d.fullName === value ||
          d.email === value
      ) ?? null
    );
  }, [value, doctors]);

  // ✅ Fetch doctors from backend
  useEffect(() => {
    let cancelled = false;

    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ Use apiClient (handles auth token + base URL)
        console.log("🔍 Fetching doctors from /doctors...");
        const res = await apiClient.get<any>("/doctors");
        console.log("📥 Doctors API response:", res);

        if (cancelled) return;

        // ✅ Handle multiple response formats
        let dataArray: Doctor[] = [];
        if (Array.isArray(res)) {
          dataArray = res;
        } else if (res?.content && Array.isArray(res.content)) {
          dataArray = res.content;
        } else if (res?.data && Array.isArray(res.data)) {
          dataArray = res.data;
        } else if (res?.data?.content && Array.isArray(res.data.content)) {
          dataArray = res.data.content;
        }

        console.log("📋 Raw data array:", dataArray);

        // ✅ Filter to only show doctors
        const realDoctors = dataArray.filter((d: Doctor) => {
          // If role exists, it must be DOCTOR
          if (d.role) {
            return d.role.toUpperCase().includes("DOCTOR");
          }
          // If no role field, include it (assume it's from doctor endpoint)
          return true;
        });

        console.log("✅ Filtered doctors:", realDoctors.length, realDoctors);

        if (!cancelled) {
          setDoctors(realDoctors);
          if (realDoctors.length === 0) {
            setError("No doctor accounts found in database");
          }
        }
      } catch (err: any) {
        console.error("❌ Failed to load doctors:", err);
        if (!cancelled) {
          setDoctors([]);
          // ✅ Better error messages based on status
          if (err?.response?.status === 401) {
            setError("Authentication required. Please login again.");
          } else if (err?.response?.status === 403) {
            setError("You don't have permission to view doctors.");
          } else if (err?.response?.status === 404) {
            setError("Doctors endpoint not found. Check API URL.");
          } else if (err?.code === "ERR_NETWORK") {
            setError("Cannot connect to server. Is backend running?");
          } else {
            setError(
              err?.response?.data?.message ||
                err?.message ||
                "Failed to load doctors"
            );
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDoctors();

    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ✅ Handle doctor selection
  const handleSelect = useCallback(
    (doctor: Doctor) => {
      const docName = doctor.name || doctor.fullName || "Doctor";
      const docId = doctor.id || doctor._id || doctor.email || docName;
      console.log("✅ Selected doctor:", { docId, docName });
      onChange(docId, docName);
      setIsOpen(false);
      setQuery("");
    },
    [onChange]
  );

  // ✅ Clear selection
  const handleClear = useCallback(() => {
    onChange("", "");
    setQuery("");
  }, [onChange]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Prepared By (Doctor) {required && <span className="text-red-500">*</span>}
      </label>

      {/* Selected doctor display */}
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
                {selected.specialization ||
                  selected.department ||
                  "General Medicine"}
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

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-xl bg-white border border-slate-200 shadow-2xl max-h-72 overflow-hidden">
          {/* Search input */}
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

          {/* Doctor list */}
          <div className="max-h-56 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-600" />
                <p className="text-xs text-slate-500 mt-2">
                  Loading doctors...
                </p>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-xs text-red-600 font-medium">{error}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Check browser console (F12) for details
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-xs text-slate-500">
                  {doctors.length === 0
                    ? "No doctor accounts found in database"
                    : "No matching doctors found"}
                </p>
              </div>
            ) : (
              filtered.map((d, index) => {
                const docName = d.name || d.fullName || "Doctor";
                const docSpec =
                  d.specialization || d.department || "General Medicine";
                return (
                  <button
                    key={d.id || d._id || d.email || index}
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