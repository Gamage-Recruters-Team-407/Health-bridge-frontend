'use client';

import React, { useState, useMemo } from 'react';
import { StaffMember, DutyStatus, StaffOverviewStats } from '@/src/types/staff';
import {
  Users,
  UserCheck,
  AlertTriangle,
  Calendar,
  Search,
  Plus,
  Download,
  Filter,
  RotateCw,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  User,
  Heart,
  ShieldAlert,
  ArrowRight,
  Check,
  Edit2
} from 'lucide-react';

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'HB-4921',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    role: 'Senior RN - ICU',
    department: 'ICU',
    email: 's.jenkins@healthbridge.org',
    phone: '+1 (555) 019-2834',
    extension: '402',
    dutyStatus: 'On Duty',
    currentShift: '08:00 - 16:00',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    initials: 'SJ',
    dob: '1985-10-12',
    gender: 'Female',
    bloodGroup: 'O Negative',
    nationalId: 'XXX-XX-8910',
    residentialAddress: '4920 Medical Center Dr, Suite 300, Metropolis, NY 10021',
    hireDate: '2023-03-15',
    emergencyContactName: 'Michael Jenkins',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '+1 (555) 928-1120',
    locationFloor: 'East Wing, Floor 3',
    accountStatus: 'Active'
  },
  {
    id: 'HB-3104',
    firstName: 'Marcus',
    lastName: 'Webb',
    role: 'Attending - Cardiology',
    department: 'Cardiology',
    email: 'm.webb@healthbridge.org',
    phone: '+1 (555) 392-1049',
    extension: '812',
    dutyStatus: 'Off Duty',
    currentShift: 'Next: 18:00 (Tomorrow)',
    initials: 'MW',
    dob: '1978-04-20',
    gender: 'Male',
    bloodGroup: 'A Positive',
    hireDate: '2021-06-01',
    accountStatus: 'Active'
  },
  {
    id: 'HB-5528',
    firstName: 'David',
    lastName: 'Chen',
    role: 'Lead Tech - Radiology',
    department: 'Radiology',
    email: 'd.chen@healthbridge.org',
    phone: '+1 (555) 482-9011',
    extension: '210',
    dutyStatus: 'Emergency Cover',
    currentShift: '12:00 - 24:00',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    initials: 'DC',
    dob: '1990-09-05',
    gender: 'Male',
    bloodGroup: 'B Positive',
    hireDate: '2022-01-10',
    accountStatus: 'Active'
  },
  {
    id: 'HB-2109',
    firstName: 'Elena',
    lastName: 'Rodriguez',
    role: 'Anesthesiologist',
    department: 'Surgery',
    email: 'e.rodriguez@healthbridge.org',
    phone: '+1 (555) 192-8833',
    extension: '305',
    dutyStatus: 'On Duty',
    currentShift: '07:00 - 15:00',
    initials: 'ER',
    dob: '1983-12-18',
    gender: 'Female',
    bloodGroup: 'AB Positive',
    hireDate: '2019-11-20',
    accountStatus: 'Active'
  },
  {
    id: 'HB-8812',
    firstName: 'Michael',
    lastName: 'Ross',
    role: 'Pediatric Nurse',
    department: 'Pediatrics',
    email: 'm.ross@healthbridge.org',
    phone: '+1 (555) 901-2244',
    extension: '112',
    dutyStatus: 'Off Duty',
    currentShift: 'Next: 08:00 (Monday)',
    initials: 'MR',
    dob: '1992-07-14',
    gender: 'Male',
    bloodGroup: 'O Positive',
    hireDate: '2023-08-01',
    accountStatus: 'Active'
  },
  {
    id: 'HB-3394',
    firstName: 'Sarah',
    lastName: 'Williams',
    role: 'Administrative Coordinator',
    department: 'Administration',
    email: 's.williams@healthbridge.org',
    phone: '+1 (555) 882-3100',
    extension: '901',
    dutyStatus: 'On Break',
    currentShift: '09:00 - 17:00',
    initials: 'SW',
    dob: '1989-02-28',
    gender: 'Female',
    bloodGroup: 'A Negative',
    hireDate: '2020-04-15',
    accountStatus: 'Active'
  }
];

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Active Menu Dropdown ID
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal States
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [profileTab, setProfileTab] = useState<'Personal' | 'Job Details' | 'Emergency Contact'>('Personal');

  // Form State for Onboarding New Staff
  const [onboardForm, setOnboardForm] = useState({
    fullName: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    email: '',
    phone: '',
    address: '',
    jobTitle: '',
    department: '',
    hireDate: ''
  });

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState<Partial<StaffMember>>({});

  // Compute Overall Stats
  const stats: StaffOverviewStats = useMemo(() => {
    return {
      totalActiveStaff: 842,
      newThisMonth: 12,
      onDutyCount: 156,
      openShiftAlerts: 12,
      pendingLeaveRequests: 5
    };
  }, []);

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = deptFilter === 'All' ? true : s.department === deptFilter;
      const matchesRole = roleFilter === 'All' ? true : s.role.includes(roleFilter);
      const matchesStatus = statusFilter === 'All' ? true : s.dutyStatus === statusFilter;

      return matchesSearch && matchesDept && matchesRole && matchesStatus;
    });
  }, [staffList, searchTerm, deptFilter, roleFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage) || 1;
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStaff.slice(start, start + itemsPerPage);
  }, [filteredStaff, currentPage]);

  // Handle Submit Onboard Form
  const handleSaveNewStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardForm.fullName || !onboardForm.email) return;

    const names = onboardForm.fullName.trim().split(' ');
    const first = names[0] || 'Staff';
    const last = names.slice(1).join(' ') || 'Member';

    const newMember: StaffMember = {
      id: `HB-${Math.floor(1000 + Math.random() * 9000)}`,
      firstName: first,
      lastName: last,
      role: onboardForm.jobTitle || 'Staff Specialist',
      department: onboardForm.department || 'General',
      email: onboardForm.email,
      phone: onboardForm.phone || '+1 (555) 000-0000',
      dutyStatus: 'On Duty',
      currentShift: '08:00 - 16:00',
      initials: `${first.charAt(0)}${last.charAt(0)}`,
      dob: onboardForm.dob,
      gender: onboardForm.gender,
      bloodGroup: onboardForm.bloodGroup,
      residentialAddress: onboardForm.address,
      hireDate: onboardForm.hireDate,
      accountStatus: 'Active'
    };

    setStaffList((prev) => [newMember, ...prev]);
    setIsOnboardModalOpen(false);
    setOnboardForm({
      fullName: '',
      dob: '',
      gender: '',
      bloodGroup: '',
      email: '',
      phone: '',
      address: '',
      jobTitle: '',
      department: '',
      hireDate: ''
    });
  };

  // Open Edit Profile Modal
  const handleOpenProfile = (staff: StaffMember) => {
    setEditingStaff(staff);
    setProfileForm({ ...staff });
    setProfileTab('Personal');
    setActiveMenuId(null);
  };

  // Save Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    setStaffList((prev) =>
      prev.map((s) => (s.id === editingStaff.id ? ({ ...s, ...profileForm } as StaffMember) : s))
    );
    setEditingStaff(null);
  };

  // Suspend Account
  const handleSuspendAccount = (id: string) => {
    if (confirm('Are you sure you want to suspend this employee account?')) {
      setStaffList((prev) =>
        prev.map((s) => (s.id === id ? { ...s, accountStatus: 'Suspended', dutyStatus: 'Off Duty' } : s))
      );
      setEditingStaff(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-3 sm:p-6 md:p-8 font-sans">
      <main className="max-w-7xl mx-auto space-y-6">
        {/* Title & Primary Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Staff Directory</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Manage personnel, monitor duty status, and handle shift assignments.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsOnboardModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#0f2c59] hover:bg-[#0a1f3f] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Staff
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-slate-400" />
              Export
            </button>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Active Staff */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Total Active Staff
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalActiveStaff}</p>
                <span className="text-[10px] sm:text-xs font-bold text-blue-600">+{stats.newThisMonth} this month</span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Card 2: On-Duty Count */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                On-Duty Count
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.onDutyCount}</p>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Current Shift
                </span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Card 3: Open Shift Alerts */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Open Shift Alerts
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl sm:text-3xl font-extrabold text-red-600">{stats.openShiftAlerts}</p>
                <span className="text-[10px] sm:text-xs font-bold text-red-500">Requires attention</span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Card 4: Pending Leave */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Pending Leave
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.pendingLeaveRequests}</p>
                <span className="text-[10px] sm:text-xs font-medium text-slate-400">Requests</span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1 max-w-lg">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Smart filter by name, role, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-7 py-2 bg-slate-100 hover:bg-slate-200/60 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 cursor-pointer outline-none"
              >
                <option value="All">Department: All</option>
                <option value="ICU">Department: ICU</option>
                <option value="Cardiology">Department: Cardiology</option>
                <option value="Radiology">Department: Radiology</option>
                <option value="Surgery">Department: Surgery</option>
                <option value="Pediatrics">Department: Pediatrics</option>
              </select>
            </div>

            <div className="relative flex-1 sm:flex-initial">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-7 py-2 bg-slate-100 hover:bg-slate-200/60 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 cursor-pointer outline-none"
              >
                <option value="All">Role: All</option>
                <option value="RN">Role: RN / Nurse</option>
                <option value="Attending">Role: Attending Physician</option>
                <option value="Tech">Role: Lead Tech</option>
                <option value="Anesthesiologist">Role: Anesthesiologist</option>
              </select>
            </div>

            <div className="relative flex-1 sm:flex-initial">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-7 py-2 bg-slate-100 hover:bg-slate-200/60 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 cursor-pointer outline-none"
              >
                <option value="All">Status: All</option>
                <option value="On Duty">Status: On Duty</option>
                <option value="Off Duty">Status: Off Duty</option>
                <option value="Emergency Cover">Status: Emergency Cover</option>
                <option value="On Break">Status: On Break</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setDeptFilter('All');
                setRoleFilter('All');
                setStatusFilter('All');
              }}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              title="Reset Filters"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">STAFF ID</th>
                  <th className="py-3.5 px-6">FULL NAME & ROLE</th>
                  <th className="py-3.5 px-6">CONTACT INFO</th>
                  <th className="py-3.5 px-6">DUTY STATUS</th>
                  <th className="py-3.5 px-6">CURRENT SHIFT</th>
                  <th className="py-3.5 px-6 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStaff.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No staff members found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-400 text-[11px]">{staff.id}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {staff.avatarUrl ? (
                            <img
                              src={staff.avatarUrl}
                              alt={staff.firstName}
                              className="w-9 h-9 rounded-full object-cover shadow-xs border border-slate-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-extrabold text-xs">
                              {staff.initials || `${staff.firstName.charAt(0)}${staff.lastName.charAt(0)}`}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {staff.firstName} {staff.lastName}
                            </p>
                            <p className="text-slate-500 font-medium text-xs">{staff.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-slate-700 font-medium">{staff.email}</p>
                        {staff.extension && <p className="text-slate-400 text-[11px]">Ext: {staff.extension}</p>}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            staff.dutyStatus === 'On Duty'
                              ? 'bg-teal-50 text-teal-600 border border-teal-200'
                              : staff.dutyStatus === 'Off Duty'
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : staff.dutyStatus === 'Emergency Cover'
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              staff.dutyStatus === 'On Duty'
                                ? 'bg-teal-500'
                                : staff.dutyStatus === 'Off Duty'
                                ? 'bg-slate-400'
                                : staff.dutyStatus === 'Emergency Cover'
                                ? 'bg-red-500'
                                : 'bg-amber-500'
                            }`}
                          ></span>
                          {staff.dutyStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-medium">{staff.currentShift}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenProfile(staff)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Pagination */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing {filteredStaff.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredStaff.length)} of {filteredStaff.length} entries
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 font-semibold"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#0f2c59] text-white'
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
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Mobile View List Cards (Matching Mobile Design in Image 1) */}
        <div className="block md:hidden space-y-3">
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Results ({filteredStaff.length})
            </h3>
          </div>

          {paginatedStaff.map((staff) => (
            <div
              key={staff.id}
              onClick={() => handleOpenProfile(staff)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-slate-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {staff.avatarUrl ? (
                  <img
                    src={staff.avatarUrl}
                    alt={staff.firstName}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-extrabold text-sm shrink-0">
                    {staff.initials || `${staff.firstName.charAt(0)}${staff.lastName.charAt(0)}`}
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {staff.firstName} {staff.lastName}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {staff.role} • {staff.department}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                      staff.dutyStatus === 'On Duty'
                        ? 'bg-teal-50 text-teal-600'
                        : staff.dutyStatus === 'Off Duty'
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    • {staff.dutyStatus}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenProfile(staff);
                }}
                className="p-2 text-slate-400 hover:text-slate-700"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          ))}

          {/* Load More Button on Mobile */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : 1))}
              className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-blue-900 font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Load More Staff
            </button>
          </div>
        </div>
      </main>

      {/* --- MODAL 1: Onboard New Staff Member (Matching Screenshot 2) --- */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-3xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <p className="text-[11px] font-bold text-slate-400">Staff Directory &gt; Add New Staff</p>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Onboard New Staff Member</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter the details below to create a new staff profile in the system.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOnboardModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveNewStaff} className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
              {/* Section 1: Core Information */}
              <div className="border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm text-blue-900">
                  <User className="w-4 h-4 text-blue-600" />
                  Core Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Jane Smith"
                      value={onboardForm.fullName}
                      onChange={(e) => setOnboardForm({ ...onboardForm, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={onboardForm.dob}
                      onChange={(e) => setOnboardForm({ ...onboardForm, dob: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Gender</label>
                    <select
                      value={onboardForm.gender}
                      onChange={(e) => setOnboardForm({ ...onboardForm, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                    >
                      <option value="">Select gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Blood Group</label>
                    <select
                      value={onboardForm.bloodGroup}
                      onChange={(e) => setOnboardForm({ ...onboardForm, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                    >
                      <option value="">Select blood group</option>
                      <option value="O Positive">O Positive</option>
                      <option value="O Negative">O Negative</option>
                      <option value="A Positive">A Positive</option>
                      <option value="A Negative">A Negative</option>
                      <option value="B Positive">B Positive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Details */}
              <div className="border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm text-blue-900">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Contact Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      placeholder="jane.smith@citygeneral.com"
                      value={onboardForm.email}
                      onChange={(e) => setOnboardForm({ ...onboardForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Personal Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={onboardForm.phone}
                      onChange={(e) => setOnboardForm({ ...onboardForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Residential Address</label>
                  <textarea
                    rows={2}
                    placeholder="Full residential address..."
                    value={onboardForm.address}
                    onChange={(e) => setOnboardForm({ ...onboardForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
              </div>

              {/* Section 3: Professional Assignment */}
              <div className="border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm text-blue-900">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Professional Assignment
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Job Title</label>
                    <select
                      value={onboardForm.jobTitle}
                      onChange={(e) => setOnboardForm({ ...onboardForm, jobTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                    >
                      <option value="">Select title</option>
                      <option value="Attending Physician">Attending Physician</option>
                      <option value="Senior RN">Senior RN</option>
                      <option value="Lead Tech">Lead Tech</option>
                      <option value="Anesthesiologist">Anesthesiologist</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Department</label>
                    <select
                      value={onboardForm.department}
                      onChange={(e) => setOnboardForm({ ...onboardForm, department: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                    >
                      <option value="">Select department</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="ICU">ICU</option>
                      <option value="Radiology">Radiology</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Pediatrics">Pediatrics</option>
                    </select>
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-slate-600 font-semibold mb-1">Hire Date</label>
                  <input
                    type="date"
                    value={onboardForm.hireDate}
                    onChange={(e) => setOnboardForm({ ...onboardForm, hireDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0f2c59] hover:bg-[#0a1f3f] text-white font-bold inline-flex items-center gap-2 shadow-sm"
                >
                  Save & Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Employee Profile & Update (Matching Screenshot 3) --- */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-3xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header Banner */}
            <div className="p-6 border-b border-slate-100 relative">
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="absolute right-6 top-6 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                {editingStaff.avatarUrl ? (
                  <img
                    src={editingStaff.avatarUrl}
                    alt={editingStaff.firstName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
                    {editingStaff.initials || `${editingStaff.firstName.charAt(0)}${editingStaff.lastName.charAt(0)}`}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {editingStaff.firstName} {editingStaff.lastName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                      {editingStaff.accountStatus || 'Active'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-blue-700 mt-0.5">
                    {editingStaff.role}, {editingStaff.department}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    ID: {editingStaff.id} • Location: {editingStaff.locationFloor || 'East Wing, Floor 3'}
                  </p>
                </div>
              </div>

              {/* Modal Navigation Tabs */}
              <div className="flex items-center gap-6 mt-6 border-b border-slate-100 text-xs font-bold text-slate-400">
                {(['Personal', 'Job Details', 'Emergency Contact'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setProfileTab(tab)}
                    className={`pb-2.5 transition-colors relative ${
                      profileTab === tab ? 'text-blue-900 font-extrabold' : 'hover:text-slate-700'
                    }`}
                  >
                    {tab}
                    {profileTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900 rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Form & Info Tab Content */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-6 text-xs max-h-[60vh] overflow-y-auto">
              {profileTab === 'Personal' && (
                <div className="space-y-4">
                  {/* Core Information Box */}
                  <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        Core Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 font-medium">Date of Birth</p>
                        <p className="font-bold text-slate-800 text-xs mt-0.5">{profileForm.dob || 'Oct 12, 1985'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">Gender</p>
                        <p className="font-bold text-slate-800 text-xs mt-0.5">{profileForm.gender || 'Female'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 font-medium">Blood Group</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-bold text-[10px]">
                          {profileForm.bloodGroup || 'O Negative'}
                        </span>
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">National ID / SSN</p>
                        <p className="font-bold text-slate-800 text-xs mt-0.5">{profileForm.nationalId || 'XXX-XX-8910'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div>
                        <p className="text-slate-400 font-medium">Primary Email</p>
                        <input
                          type="email"
                          value={profileForm.email || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 mt-1 outline-none"
                        />
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">Phone Number</p>
                        <input
                          type="text"
                          value={profileForm.phone || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 mt-1 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-400 font-medium">Residential Address</p>
                      <textarea
                        rows={2}
                        value={profileForm.residentialAddress || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, residentialAddress: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 mt-1 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'Job Details' && (
                <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    Job Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 font-medium">Hire Date</p>
                      <p className="font-bold text-slate-800 mt-0.5">{profileForm.hireDate || 'March 15, 2023'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Department</p>
                      <p className="font-bold text-slate-800 mt-0.5">{profileForm.department || 'Cardiology'}</p>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'Emergency Contact' && (
                <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    Emergency Contact
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 font-medium">Contact Name</p>
                      <p className="font-bold text-slate-800 mt-0.5">{profileForm.emergencyContactName || 'Michael Jenkins'}</p>
                      <p className="text-slate-400 text-[11px]">{profileForm.emergencyContactRelation || 'Spouse'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Phone</p>
                      <p className="font-bold text-slate-800 mt-0.5">{profileForm.emergencyContactPhone || '+1 (555) 928-1120'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSuspendAccount(editingStaff.id)}
                  className="text-red-600 hover:text-red-800 font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Suspend Account
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingStaff(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0f2c59] hover:bg-[#0a1f3f] text-white font-bold shadow-sm"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
