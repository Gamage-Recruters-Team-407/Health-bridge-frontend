"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { prescriptionService } from "@/services/prescriptionService";
import { Prescription } from "@/types/prescription";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Download, Eye, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 5;

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPrescriptions();
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      let data: Prescription[] = [];
      
      if (user?.role === "DOCTOR") {
        data = await prescriptionService.getPrescriptionsByDoctorId(user.id);
      } else if (user?.role === "PATIENT") {
        data = await prescriptionService.getPatientPrescriptions(user.id);
      } else {
        data = await prescriptionService.getAllPrescriptions();
      }
      
      setPrescriptions(data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. මුලින්ම Search එකට ගැලපෙන data ටික filter කරගන්නවා
  const filteredPrescriptions = prescriptions.filter((p) => 
    p.patientName.toLowerCase().includes(search.toLowerCase()) || 
    p.prescriptionNumber.toLowerCase().includes(search.toLowerCase())
  );

  // 2. Filter කරපු data ටිකෙන් පිටුවකට ඕනේ ප්‍රමාණය (5) කපාගන්නවා
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredPrescriptions.slice(indexOfFirstItem, indexOfLastItem);

  // 3. මුළු පිටු ගණන calculate කරනවා
  const totalPages = Math.ceil(filteredPrescriptions.length / ITEMS_PER_PAGE);

  // Page එක මාරු කරන functions
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Search එක වෙනස් වුනාම පළවෙනි පිටුවට යන්න
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-sm text-slate-500">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Prescriptions</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage and view your prescriptions
        </p>
      </div>

      {/* Search and Create */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient name or Rx number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        {user?.role === "DOCTOR" && (
          <Link
            href="/prescriptions/create"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Prescription
          </Link>
        )}
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {currentItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-sm font-semibold text-slate-900">No prescriptions found</h3>
            <p className="mt-1 text-xs text-slate-500">
              {user?.role === "PATIENT" 
                ? "You don't have any prescriptions yet." 
                : "Create a prescription to get started."}
            </p>
          </div>
        ) : (
          currentItems.map((prescription) => (
            <div
              key={prescription.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {prescription.prescriptionNumber}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        prescription.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {prescription.status}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-slate-900">
                    {prescription.patientName}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Dr. {prescription.doctorName} • {new Date(prescription.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {prescription.items.length} medicine{prescription.items.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/prescriptions/${prescription.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                  <Link
                    href={`/prescriptions/${prescription.id}/download`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-900">{indexOfFirstItem + 1}</span> to{" "}
            <span className="font-semibold text-slate-900">
              {Math.min(indexOfLastItem, filteredPrescriptions.length)}
            </span>{" "}
            of <span className="font-semibold text-slate-900">{filteredPrescriptions.length}</span> results
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}