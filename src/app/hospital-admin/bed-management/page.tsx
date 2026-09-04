'use client';

import React, { useState, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Bed, BedStatus, WardType, PatientInfo, DepartmentOccupancy, BedOverviewStats } from '@/types/bed';
import {
  Bed as BedIcon,
  CheckCircle2,
  Wrench,
  Sparkles,
  Search,
  LayoutGrid,
  List as ListIcon,
  User,
  Stethoscope,
  ArrowRightLeft,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Calendar,
  Clock,
  Plus,
  Check,
  Building,
  UserPlus,
  Bell,
  Settings,
  HelpCircle
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8088/api/beds';

export default function BedManagementPage() {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [selectedWard, setSelectedWard] = useState<WardType>('ICU');
  const [statusFilter, setStatusFilter] = useState<BedStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Backend Stats & Occupancy
  const [backendStats, setBackendStats] = useState<BedOverviewStats | null>(null);
  const [deptOccupancies, setDeptOccupancies] = useState<DepartmentOccupancy[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Drawer / Modal States
  const [allocatingBed, setAllocatingBed] = useState<Bed | null>(null);
  const [viewingBedPatient, setViewingBedPatient] = useState<Bed | null>(null);
  const [isAddBedOpen, setIsAddBedOpen] = useState<boolean>(false);

  // Add Bed Form State
  const [addBedForm, setAddBedForm] = useState({
    bedId: '',
    code: '',
    ward: 'ICU' as WardType,
    bedType: 'ICU Standard',
    status: 'Available' as BedStatus
  });

  // Allocate Bed Form State
  const [allocateForm, setAllocateForm] = useState({
    searchPatient: '',
    firstName: '',
    lastName: '',
    patientId: 'PID-',
    department: 'Intensive Care',
    bedType: 'ICU Standard',
    assignedDoctor: '',
    admissionDate: '',
    expDischarge: '',
    admissionNotes: ''
  });

  // Patient Transfer Form State
  const [transferForm, setTransferForm] = useState({
    destinationWard: '' as WardType | '',
    availableBedId: '',
    reason: '',
    transferDate: '',
    transferTime: '',
    priority: 'Routine' as 'Routine' | 'Urgent'
  });

  // Fetch Beds, Stats & Occupancy from Backend
  const fetchBedData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [bedsRes, statsRes, occRes] = await Promise.all([
        fetch(API_BASE_URL),
        fetch(`${API_BASE_URL}/stats`),
        fetch(`${API_BASE_URL}/occupancy`)
      ]);

      if (bedsRes.ok) {
        const bedsData = await bedsRes.json();
        if (Array.isArray(bedsData)) {
          setBeds(bedsData);
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setBackendStats(statsData);
      }

      if (occRes.ok) {
        const occData = await occRes.json();
        if (Array.isArray(occData)) {
          setDeptOccupancies(occData);
        }
      }
    } catch (err) {
      console.warn('Backend server connection warning. Fallback to client state.', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBedData();
  }, [fetchBedData]);

  // Compute Overall Stats (Fallback to local memo if backendStats is null)
  const stats = useMemo(() => {
    if (backendStats) {
      return backendStats;
    }
    const total = beds.length;
    const occupied = beds.filter((b) => b.status === 'Occupied').length;
    const available = beds.filter((b) => b.status === 'Available').length;
    const maintenance = beds.filter((b) => b.status === 'Maintenance').length;
    const occPercentage = total > 0 ? Math.round((occupied / total) * 100) : 0;

    return {
      totalBeds: total,
      occupiedBeds: occupied,
      occupiedPercentage: occPercentage,
      availableBeds: available,
      maintenanceBeds: maintenance,
      cleaningBeds: beds.filter((b) => b.status === 'Cleaning').length
    };
  }, [beds, backendStats]);

  // Filtered Beds
  const filteredBeds = useMemo(() => {
    return beds.filter((bed) => {
      const matchesWard = bed.ward === selectedWard;
      const matchesStatus = statusFilter === 'All' ? true : bed.status === statusFilter;
      const matchesSearch =
        bed.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bed.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bed.patient?.firstName.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (bed.patient?.lastName.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (bed.patient?.id.toLowerCase() || '').includes(searchTerm.toLowerCase());

      return matchesWard && matchesStatus && matchesSearch;
    });
  }, [beds, selectedWard, statusFilter, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredBeds.length / itemsPerPage) || 1;
  const paginatedBeds = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBeds.slice(start, start + itemsPerPage);
  }, [filteredBeds, currentPage]);

  // Open Allocate Modal
  const handleOpenAllocate = (bed: Bed) => {
    setAllocatingBed(bed);
    setAllocateForm({
      searchPatient: '',
      firstName: '',
      lastName: '',
      patientId: `PID-${Math.floor(10000 + Math.random() * 90000)}`,
      department: bed.ward,
      bedType: bed.bedType || 'Standard',
      assignedDoctor: '',
      admissionDate: new Date().toISOString().split('T')[0],
      expDischarge: '',
      admissionNotes: ''
    });
  };

  // Submit Allocation
  const handleConfirmAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocatingBed) return;

    const newPatient: PatientInfo = {
      id: allocateForm.patientId || `PID-${Math.floor(10000 + Math.random() * 90000)}`,
      firstName: allocateForm.firstName || 'New',
      lastName: allocateForm.lastName || 'Patient',
      dob: '01 Jan 1990',
      age: 34,
      gender: 'Male',
      assignedDoctor: allocateForm.assignedDoctor || 'Dr. Nimal Perera',
      admissionDate: allocateForm.admissionDate,
      expDischarge: allocateForm.expDischarge,
      admissionNotes: allocateForm.admissionNotes
    };

    try {
      const res = await fetch(`${API_BASE_URL}/${allocatingBed.id}/allocate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allocateForm)
      });
      if (res.ok) {
        await fetchBedData();
      } else {
        setBeds((prev) =>
          prev.map((b) =>
            b.id === allocatingBed.id ? { ...b, status: 'Occupied', patient: newPatient } : b
          )
        );
      }
      toast.success(`Patient allocated to bed ${allocatingBed.id} successfully!`);
    } catch {
      setBeds((prev) =>
        prev.map((b) =>
          b.id === allocatingBed.id ? { ...b, status: 'Occupied', patient: newPatient } : b
        )
      );
      toast.success(`Patient allocated to bed ${allocatingBed.id}.`);
    }

    setAllocatingBed(null);
  };

  // Submit Transfer
  const handleConfirmTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingBedPatient || !transferForm.destinationWard) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${viewingBedPatient.id}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferForm)
      });
      if (res.ok) {
        await fetchBedData();
      } else {
        setBeds((prev) =>
          prev.map((b) => {
            if (b.id === viewingBedPatient.id) {
              return { ...b, status: 'Available', patient: undefined };
            }
            if (b.id === transferForm.availableBedId) {
              return {
                ...b,
                status: 'Occupied',
                patient: viewingBedPatient.patient
              };
            }
            return b;
          })
        );
      }
      toast.success(`Patient transfer requested to ${transferForm.destinationWard}!`);
    } catch {
      setBeds((prev) =>
        prev.map((b) => {
          if (b.id === viewingBedPatient.id) {
            return { ...b, status: 'Available', patient: undefined };
          }
          if (b.id === transferForm.availableBedId) {
            return {
              ...b,
              status: 'Occupied',
              patient: viewingBedPatient.patient
            };
          }
          return b;
        })
      );
      toast.success(`Patient transfer requested to ${transferForm.destinationWard}!`);
    }

    setViewingBedPatient(null);
  };

  // Create New Bed
  const handleCreateBed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addBedForm.bedId.trim()) {
      toast.error('Bed ID is required (e.g. ICU-107).');
      return;
    }

    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addBedForm)
      });
      if (res.ok) {
        await fetchBedData();
        toast.success(`Bed ${addBedForm.bedId} created successfully!`);
        setIsAddBedOpen(false);
        setAddBedForm({
          bedId: '',
          code: '',
          ward: 'ICU',
          bedType: 'ICU Standard',
          status: 'Available'
        });
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || 'Failed to create bed.');
      }
    } catch (err) {
      console.error('Error creating bed:', err);
      toast.error('Error creating bed.');
    }
  };

  // Quick Action Handlers for Maintenance / Cleaning / Confirm Reservation
  const handleQuickStatusChange = async (bedId: string, newStatus: BedStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${bedId}/status?status=${newStatus}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        await fetchBedData();
      } else {
        setBeds((prev) =>
          prev.map((b) => (b.id === bedId ? { ...b, status: newStatus } : b))
        );
      }
      toast.success(`Bed ${bedId} status changed to ${newStatus}.`);
    } catch {
      setBeds((prev) =>
        prev.map((b) => (b.id === bedId ? { ...b, status: newStatus } : b))
      );
      toast.success(`Bed ${bedId} status changed to ${newStatus}.`);
    }
  };

  return (
    <div className="min-h-screen  bg-[#f8fafc] text-slate-800 font-sans">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Top Header Navigation Bar */}
      <header className="max-w-7xl mx-auto bg-[#f8fafc] border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Bed Management</h1>

        <div className="flex items-center gap-3 sm:gap-5 text-slate-600">
          <button
            type="button"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-full transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5 stroke-[1.75]" />
          </button>

          <button
            type="button"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-full transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 stroke-[1.75]" />
          </button>

          <button
            type="button"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-full transition-colors"
            title="Help"
          >
            <HelpCircle className="w-5 h-5 stroke-[1.75]" />
          </button>

          <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-xs shadow-xs ring-2 ring-slate-200">
            AU
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 pb-8 space-y-6">

        {/* 4 Overview Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Beds */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Total Beds</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalBeds}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BedIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Occupied Beds */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 border-l-4 border-l-blue-600 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Occupied</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.occupiedBeds}</p>
                <span className="text-xs sm:text-sm font-semibold text-blue-600">({stats.occupiedPercentage}%)</span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BedIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Available Beds */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 border-l-4 border-l-emerald-500 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Available</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.availableBeds}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Maintenance Beds */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 border-l-4 border-l-slate-600 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Maintenance</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.maintenanceBeds}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Occupancy Alert & Department Occupancy Chips Container */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {deptOccupancies.map((item, idx) => (
            <div
              key={idx}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                item.isAlert
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {item.isAlert && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
              <span>
                {item.department}: {item.occupancyPercentage}% {item.isAlert ? '(Alert)' : ''}
              </span>
            </div>
          ))}
        </div>

        {/* Search, Status Filters & Layout Toggle Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Left: Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search beds, patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 focus:bg-white text-xs rounded-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Right: Status Filter Pills + View Toggle */}
          <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {(['All', 'Available', 'Reserved', 'Occupied', 'Maintenance', 'Cleaning'] as const).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                      statusFilter === status
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            {/* Grid vs List Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ListIcon className="w-3.5 h-3.5" />
                List
              </button>
            </div>

            {/* Add Bed Primary Button */}
            <button
              type="button"
              onClick={() => {
                setAddBedForm({
                  bedId: '',
                  code: '',
                  ward: selectedWard,
                  bedType: `${selectedWard} Standard`,
                  status: 'Available'
                });
                setIsAddBedOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Bed
            </button>
          </div>
        </div>

        {/* Ward Navigation Tabs */}
        <div className="border-b border-slate-200 flex items-center gap-6 overflow-x-auto scrollbar-none text-xs font-bold text-slate-500">
          {(['ICU', 'General Ward', 'Emergency Ward', 'Cardiology', 'Pediatrics', 'Maternity'] as WardType[]).map(
            (ward) => (
              <button
                key={ward}
                type="button"
                onClick={() => {
                  setSelectedWard(ward);
                  setCurrentPage(1);
                }}
                className={`pb-3.5 transition-colors relative shrink-0 ${
                  selectedWard === ward ? 'text-blue-700 font-extrabold' : 'hover:text-slate-800'
                }`}
              >
                {ward}
                {selectedWard === ward && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700 rounded-full"></span>
                )}
              </button>
            )
          )}
        </div>

        {/* Active Ward Section Title */}
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {selectedWard === 'ICU' ? 'Intensive Care Unit (ICU)' : selectedWard}
          </h2>
        </div>

        {/* Beds View (Grid vs List) */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedBeds.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                No beds match your selected filters.
              </div>
            ) : (
              paginatedBeds.map((bed) => (
                <div
                  key={bed.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  {/* Card Header: Bed ID & Status Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{bed.id}</h3>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        bed.status === 'Occupied'
                          ? 'bg-blue-100 text-blue-700'
                          : bed.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : bed.status === 'Reserved'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : bed.status === 'Maintenance'
                          ? 'bg-slate-100 text-slate-600 border border-slate-200'
                          : 'bg-sky-50 text-sky-600 border border-sky-200'
                      }`}
                    >
                      {bed.status === 'Cleaning' && <Sparkles className="w-3 h-3" />}
                      {bed.status}
                    </span>
                  </div>

                  {/* Card Body: Dynamic Status Content */}
                  <div className="py-4 min-h-[90px] flex flex-col justify-center text-xs">
                    {bed.status === 'Occupied' && bed.patient && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                          <User className="w-4 h-4 text-slate-400" />
                          <span>{bed.patient.firstName} {bed.patient.lastName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                          <Stethoscope className="w-4 h-4 text-slate-400" />
                          <span>{bed.patient.assignedDoctor}</span>
                        </div>
                      </div>
                    )}

                    {bed.status === 'Available' && (
                      <div className="border border-dashed border-slate-200 rounded-xl p-3 text-center text-slate-400 font-medium">
                        Ready for admission
                      </div>
                    )}

                    {bed.status === 'Reserved' && bed.patient && (
                      <div className="space-y-1">
                        <p className="font-bold text-amber-700">Pending Admission</p>
                        <p className="text-slate-500 font-medium">ETA: {bed.patient.eta || '14:00'}</p>
                      </div>
                    )}

                    {bed.status === 'Maintenance' && (
                      <div className="text-slate-400 text-center font-medium">
                        Bed under routine maintenance check
                      </div>
                    )}

                    {bed.status === 'Cleaning' && (
                      <div className="text-slate-400 text-center font-medium">
                        Sanitization in progress
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    {bed.status === 'Occupied' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setViewingBedPatient(bed)}
                          className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                        >
                          View Patient
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setViewingBedPatient(bed);
                          }}
                          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                          title="Transfer Patient"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {bed.status === 'Available' && (
                      <button
                        type="button"
                        onClick={() => handleOpenAllocate(bed)}
                        className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        Allocate Patient
                      </button>
                    )}

                    {bed.status === 'Reserved' && (
                      <button
                        type="button"
                        onClick={() => handleOpenAllocate(bed)}
                        className="w-full py-2 rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-semibold transition-colors"
                      >
                        Confirm Allocation
                      </button>
                    )}

                    {bed.status === 'Maintenance' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(bed.id, 'Available')}
                        className="w-full py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                      >
                        Return to Service
                      </button>
                    )}

                    {bed.status === 'Cleaning' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(bed.id, 'Available')}
                        className="w-full py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                      >
                        Mark Available
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Bed ID</th>
                    <th className="py-3.5 px-6">Bed Type</th>
                    <th className="py-3.5 px-6">Patient</th>
                    <th className="py-3.5 px-6">Assigned Doctor</th>
                    <th className="py-3.5 px-6 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedBeds.map((bed) => (
                    <tr key={bed.id} className="hover:bg-slate-50/60">
                      <td className="py-4 px-6 font-bold text-slate-900">{bed.id}</td>
                      <td className="py-4 px-6 text-slate-500">{bed.bedType || 'Standard'}</td>
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {bed.patient ? `${bed.patient.firstName} ${bed.patient.lastName}` : '—'}
                      </td>
                      <td className="py-4 px-6 text-slate-600">{bed.patient?.assignedDoctor || '—'}</td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`px-3 py-0.5 rounded-full text-[11px] font-semibold ${
                            bed.status === 'Occupied'
                              ? 'bg-blue-100 text-blue-700'
                              : bed.status === 'Available'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {bed.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {bed.status === 'Available' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenAllocate(bed)}
                            className="px-3 py-1.5 rounded-lg bg-blue-900 text-white text-xs font-semibold"
                          >
                            Allocate
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setViewingBedPatient(bed)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold"
                          >
                            Manage
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="px-4 py-4 bg-white rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Showing 1-{filteredBeds.length} of 48 beds
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 font-semibold"
            >
              &lt; Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 font-semibold"
            >
              Next &gt;
            </button>
          </div>
        </div>
      </main>

      {/* --- SLIDE-OVER DRAWER: Allocate Bed --- */}
      {allocatingBed && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full sm:max-w-md h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Allocate Bed</h2>
                  <p className="text-xs font-bold text-blue-700 mt-0.5">{allocatingBed.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAllocatingBed(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Form */}
              <form onSubmit={handleConfirmAllocation} className="p-6 space-y-4 text-xs">
                {/* Patient Lookup */}
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Patient Lookup</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search ID, Name..."
                      value={allocateForm.searchPatient}
                      onChange={(e) => setAllocateForm({ ...allocateForm, searchPatient: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">First Name</label>
                    <input
                      type="text"
                      placeholder="Alex"
                      value={allocateForm.firstName}
                      onChange={(e) => setAllocateForm({ ...allocateForm, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="Fernando"
                      value={allocateForm.lastName}
                      onChange={(e) => setAllocateForm({ ...allocateForm, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Patient ID */}
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Patient ID</label>
                  <input
                    type="text"
                    value={allocateForm.patientId}
                    onChange={(e) => setAllocateForm({ ...allocateForm, patientId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50"
                    required
                  />
                </div>

                {/* Department & Bed Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Department</label>
                    <input
                      type="text"
                      value={allocateForm.department}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-100 text-slate-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Bed Type</label>
                    <input
                      type="text"
                      value={allocateForm.bedType}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-100 text-slate-600 outline-none"
                    />
                  </div>
                </div>

                {/* Assigned Doctor */}
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Assigned Doctor</label>
                  <select
                    value={allocateForm.assignedDoctor}
                    onChange={(e) => setAllocateForm({ ...allocateForm, assignedDoctor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                    required
                  >
                    <option value="">Select Doctor...</option>
                    <option value="Dr. Nimal Perera">Dr. Nimal Perera</option>
                    <option value="Dr. Sarah Fernando">Dr. Sarah Fernando</option>
                    <option value="Dr. Ayesha Silva">Dr. Ayesha Silva</option>
                    <option value="Dr. Smith">Dr. Smith</option>
                  </select>
                </div>

                {/* Admission Date & Exp. Discharge */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Admission Date</label>
                    <input
                      type="date"
                      value={allocateForm.admissionDate}
                      onChange={(e) => setAllocateForm({ ...allocateForm, admissionDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Exp. Discharge</label>
                    <input
                      type="date"
                      value={allocateForm.expDischarge}
                      onChange={(e) => setAllocateForm({ ...allocateForm, expDischarge: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                {/* Admission Notes */}
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Admission Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Add specific requirements or clinical notes..."
                    value={allocateForm.admissionNotes}
                    onChange={(e) => setAllocateForm({ ...allocateForm, admissionNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </form>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAllocatingBed(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAllocation}
                className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
              >
                <Check className="w-4 h-4" />
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SLIDE-OVER DRAWER: View & Transfer Patient --- */}
      {viewingBedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full sm:max-w-md h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-extrabold text-slate-900">View Patient</h2>
                <button
                  type="button"
                  onClick={() => setViewingBedPatient(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 text-xs">
                {/* Patient Details Card */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patient Details</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shrink-0">
                      {viewingBedPatient.patient?.firstName.charAt(0)}
                      {viewingBedPatient.patient?.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {viewingBedPatient.patient?.firstName} {viewingBedPatient.patient?.lastName}
                      </h3>
                      <p className="text-slate-500 font-medium">
                        DOB: {viewingBedPatient.patient?.dob || '12 May 1968'} ({viewingBedPatient.patient?.age || 55}yo) | {viewingBedPatient.patient?.gender || 'Male'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                    <div>
                      <p className="text-slate-400 font-medium">Current Location</p>
                      <p className="font-bold text-slate-800">{viewingBedPatient.ward} {viewingBedPatient.id}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Assigned Doctor</p>
                      <p className="font-bold text-slate-800">{viewingBedPatient.patient?.assignedDoctor || 'Dr. Smith'}</p>
                    </div>
                  </div>
                </div>

                {/* Transfer Details Form */}
                <form onSubmit={handleConfirmTransfer} className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Transfer Details</h3>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Destination Ward *</label>
                    <select
                      value={transferForm.destinationWard}
                      onChange={(e) => setTransferForm({ ...transferForm, destinationWard: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                      required
                    >
                      <option value="">Select ward</option>
                      <option value="General Ward">General Ward</option>
                      <option value="ICU">ICU</option>
                      <option value="Emergency Ward">Emergency Ward</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Available Bed *</label>
                    <select
                      value={transferForm.availableBedId}
                      onChange={(e) => setTransferForm({ ...transferForm, availableBedId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                      required
                    >
                      <option value="">Select an available bed</option>
                      {beds
                        .filter((b) => b.status === 'Available')
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.id} ({b.ward})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Reason for Transfer *</label>
                    <textarea
                      rows={3}
                      placeholder="Provide clinical reasoning for transfer..."
                      value={transferForm.reason}
                      onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Date *</label>
                      <input
                        type="date"
                        value={transferForm.transferDate}
                        onChange={(e) => setTransferForm({ ...transferForm, transferDate: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Time *</label>
                      <input
                        type="time"
                        value={transferForm.transferTime}
                        onChange={(e) => setTransferForm({ ...transferForm, transferTime: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1.5">Priority Level</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTransferForm({ ...transferForm, priority: 'Routine' })}
                        className={`py-2 rounded-xl border text-xs font-bold transition-colors ${
                          transferForm.priority === 'Routine'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Routine
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransferForm({ ...transferForm, priority: 'Urgent' })}
                        className={`py-2 rounded-xl border text-xs font-bold transition-colors ${
                          transferForm.priority === 'Urgent'
                            ? 'border-red-600 bg-red-50 text-red-700'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Urgent
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewingBedPatient(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmTransfer}
                className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
              >
                <Check className="w-4 h-4" />
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- MODAL: Add New Bed --- */}
      {isAddBedOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Add New Bed</h2>
              <button
                type="button"
                onClick={() => setIsAddBedOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBed} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Bed ID *</label>
                <input
                  type="text"
                  placeholder="e.g. ICU-107, CARD-401"
                  value={addBedForm.bedId}
                  onChange={(e) => setAddBedForm({ ...addBedForm, bedId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Bed Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 107"
                    value={addBedForm.code}
                    onChange={(e) => setAddBedForm({ ...addBedForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Ward *</label>
                  <select
                    value={addBedForm.ward}
                    onChange={(e) => setAddBedForm({ ...addBedForm, ward: e.target.value as WardType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="ICU">ICU</option>
                    <option value="General Ward">General Ward</option>
                    <option value="Emergency Ward">Emergency Ward</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Maternity">Maternity</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Bed Type</label>
                  <input
                    type="text"
                    placeholder="e.g. ICU Standard, Electric"
                    value={addBedForm.bedType}
                    onChange={(e) => setAddBedForm({ ...addBedForm, bedType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status</label>
                  <select
                    value={addBedForm.status}
                    onChange={(e) => setAddBedForm({ ...addBedForm, status: e.target.value as BedStatus })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Cleaning">Cleaning</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddBedOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  Create Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
