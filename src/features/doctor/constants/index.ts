import type { Availability, Doctor, DoctorLeave, Earnings } from "../types";

export const SPECIALIZATIONS = ["All specializations", "Cardiology", "Dermatology", "Neurology", "Pediatrics", "General Medicine"];

export const mockDoctors: Doctor[] = [
  { id: "doc-001", fullName: "Dr. Maya Perera", email: "maya.perera@healthbridge.lk", phoneNumber: "+94 77 234 8801", profileImage: "https://i.pravatar.cc/320?img=47", gender: "Female", dateOfBirth: "1985-04-18", address: "42 Lake Road, Colombo 03", specialization: "Cardiology", qualifications: ["MBBS", "MD Cardiology"], experience: 12, consultationFee: 6500, rating: 4.9, availableToday: true, bio: "Consultant cardiologist focused on preventive heart care and long-term patient outcomes." },
  { id: "doc-002", fullName: "Dr. Nimal Fernando", email: "nimal.fernando@healthbridge.lk", phoneNumber: "+94 71 884 9022", profileImage: "https://i.pravatar.cc/320?img=12", gender: "Male", dateOfBirth: "1981-08-09", address: "18 Temple Lane, Kandy", specialization: "Neurology", qualifications: ["MBBS", "MRCP", "MD Neurology"], experience: 16, consultationFee: 7200, rating: 4.8, availableToday: false },
  { id: "doc-003", fullName: "Dr. Ayesha Silva", email: "ayesha.silva@healthbridge.lk", phoneNumber: "+94 76 114 7820", profileImage: "https://i.pravatar.cc/320?img=32", gender: "Female", dateOfBirth: "1989-11-24", address: "7 Palm Grove, Galle", specialization: "Pediatrics", qualifications: ["MBBS", "DCH", "MD Pediatrics"], experience: 9, consultationFee: 4800, rating: 4.9, availableToday: true },
  { id: "doc-004", fullName: "Dr. Kasun Jayawardena", email: "kasun.j@healthbridge.lk", phoneNumber: "+94 75 552 0190", profileImage: "https://i.pravatar.cc/320?img=68", gender: "Male", dateOfBirth: "1987-02-14", address: "112 Main Street, Negombo", specialization: "Dermatology", qualifications: ["MBBS", "MD Dermatology"], experience: 11, consultationFee: 5500, rating: 4.7, availableToday: true },
  { id: "doc-005", fullName: "Dr. Shalini Rao", email: "shalini.rao@healthbridge.lk", phoneNumber: "+94 70 331 4288", profileImage: "https://i.pravatar.cc/320?img=25", gender: "Female", dateOfBirth: "1990-06-30", address: "5 Park Avenue, Colombo 05", specialization: "General Medicine", qualifications: ["MBBS", "MD Internal Medicine"], experience: 8, consultationFee: 4000, rating: 4.8, availableToday: false },
];

export const mockAvailability: Availability[] = [
  { id: "slot-1", date: "2026-08-24", startTime: "09:00", endTime: "12:00", status: "Available" },
  { id: "slot-2", date: "2026-08-25", startTime: "14:00", endTime: "18:00", status: "Available" },
  { id: "slot-3", date: "2026-08-26", startTime: "09:00", endTime: "13:00", status: "Available" },
  { id: "slot-4", date: "2026-08-27", startTime: "10:00", endTime: "12:00", status: "Unavailable" },
  { id: "slot-5", date: "2026-08-28", startTime: "08:30", endTime: "15:30", status: "Available" },
];

export const mockLeaves: DoctorLeave[] = [
  { id: "leave-1", leaveType: "Annual", startDate: "2026-09-14", endDate: "2026-09-18", reason: "Family travel", status: "Approved", appliedAt: "2026-07-28" },
  { id: "leave-2", leaveType: "Sick", startDate: "2026-06-03", endDate: "2026-06-04", reason: "Medical rest", status: "Approved", appliedAt: "2026-06-03" },
  { id: "leave-3", leaveType: "Other", startDate: "2026-10-09", endDate: "2026-10-09", reason: "Professional conference", status: "Pending", appliedAt: "2026-08-20" },
];

export const mockEarnings: Earnings = {
  totalEarnings: 1284500, monthlyEarnings: 186500, consultationIncome: 171000, pendingAmount: 15500,
  revenue: [{ month: "Mar", amount: 132000 }, { month: "Apr", amount: 148500 }, { month: "May", amount: 141000 }, { month: "Jun", amount: 166000 }, { month: "Jul", amount: 159500 }, { month: "Aug", amount: 186500 }],
  payments: [
    { id: "HB-1028", patientName: "Ruwan Senanayake", date: "2026-08-24", service: "Video consultation", amount: 6500, status: "Paid" },
    { id: "HB-1027", patientName: "Nadeesha Dissanayake", date: "2026-08-24", service: "Clinic consultation", amount: 6500, status: "Paid" },
    { id: "HB-1026", patientName: "Ishara Wijesinghe", date: "2026-08-23", service: "Follow-up", amount: 4500, status: "Pending" },
    { id: "HB-1025", patientName: "Tharindu Madushan", date: "2026-08-22", service: "Clinic consultation", amount: 6500, status: "Paid" },
  ],
};
