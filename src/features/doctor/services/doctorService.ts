import api, { getApiErrorMessage } from "@/lib/axios";
import axios from "axios";
import { getStoredUser, getToken, saveAuthData } from "@/lib/auth";
import type { Availability, AvailabilityInput, Doctor, DoctorLeave, DoctorProfileUpdate, Earnings, LeaveInput } from "../types";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const getDoctorId = () => {
  const user = getStoredUser();
  if (!user) return "doc-user";
  return user.id;
};

// Fallback initial doctor profile generated strictly from current logged-in session user details
function getDefaultProfile(): Doctor {
  const user = typeof window !== "undefined" ? getStoredUser() : null;
  const userObj = user as any;
  const name = userObj?.fullName || userObj?.name || "Doctor";
  const email = user?.email || "doctor@healthbridge.lk";
  const formattedName = name.toLowerCase().startsWith("dr.") ? name : `Dr. ${name}`;

  return {
    id: user?.id || "doc-user",
    fullName: formattedName,
    email: email,
    phoneNumber: "+94 77 000 0000",
    profileImage: "https://i.pravatar.cc/320?img=47",
    gender: "Other",
    dateOfBirth: "1990-01-01",
    address: "Colombo, Sri Lanka",
    specialization: "General Medicine",
    qualifications: ["MBBS"],
    experience: 5,
    consultationFee: 5000,
    rating: 5.0,
    availableToday: true,
    bio: "Consultant Medical Officer.",
  };
}

let profile: Doctor = getDefaultProfile();

export async function getDoctorProfile(): Promise<Doctor> {
  if (typeof window !== "undefined") {
    const user = getStoredUser();
    const email = user?.email?.toLowerCase().trim() || "doctor@healthbridge.lk";

    // 1. Check email specific doctor profile persistence
    const savedDocProfile = localStorage.getItem(`healthbridge_doctor_profile_${email}`) || localStorage.getItem("healthbridge_doctor_profile");
    if (savedDocProfile) {
      try {
        const parsed = JSON.parse(savedDocProfile);
        profile = { ...getDefaultProfile(), ...parsed };
      } catch {
        profile = getDefaultProfile();
      }
    } else {
      profile = getDefaultProfile();
    }

    // 2. Check email specific user name override
    const savedUserOverride = localStorage.getItem(`healthbridge_user_override_${email}`);
    if (savedUserOverride) {
      try {
        const parsedUser = JSON.parse(savedUserOverride);
        if (parsedUser.fullName) {
          profile.fullName = parsedUser.fullName;
        }
      } catch {
        // ignore
      }
    }
  }

  try {
    const res = await api.get<Doctor>("/doctors/me");
    if (res) return res;
  } catch {
    // API endpoint optional or unavailable, return active user profile
  }

  return { ...profile };
}

export async function updateDoctorProfile(data: DoctorProfileUpdate): Promise<Doctor> {
  try {
    const res = await api.put<Doctor>("/doctors/me", data);
    if (res) profile = { ...profile, ...res };
  } catch (error) {
    const missingEndpoint = axios.isAxiosError(error) && (error.response?.status === 404
      || (error.response?.status === 500 && String(error.response.data?.message).startsWith("No static resource")));
    if (!missingEndpoint) {
      throw new Error(getApiErrorMessage(error, "Unable to save your profile. Check the backend connection and try again."));
    }
    profile = { ...profile, ...data };
  }

  if (typeof window !== "undefined") {
    const user = getStoredUser();
    const email = (data.email || user?.email || "doctor@healthbridge.lk").toLowerCase().trim();

    // Persist doctor profile by user email across sessions/logins
    localStorage.setItem(`healthbridge_doctor_profile_${email}`, JSON.stringify(profile));
    localStorage.setItem("healthbridge_doctor_profile", JSON.stringify(profile));

    // Persist user override by email
    localStorage.setItem(`healthbridge_user_override_${email}`, JSON.stringify({ fullName: profile.fullName, email: profile.email }));

    // Update active user state in localStorage
    const stored = localStorage.getItem("healthbridge_user");
    let userObj: any = {};
    if (stored) {
      try {
        userObj = JSON.parse(stored);
      } catch {
        userObj = {};
      }
    }
    userObj.fullName = profile.fullName;
    userObj.name = profile.fullName;
    userObj.email = profile.email;
    const token = getToken();
    const currentUser = getStoredUser();
    if (token && currentUser) {
      saveAuthData(token, { ...currentUser, fullName: profile.fullName, email: profile.email });
    }

    window.dispatchEvent(new Event("user-profile-updated"));
    window.dispatchEvent(new Event("storage"));
  }

  return { ...profile };
}

export async function getDoctors(): Promise<Doctor[]> {
  const currentProfile = await getDoctorProfile();
  let doctorList: Doctor[] = [];

  try {
    const raw: any = await api.get<any>("/doctors");
    const res = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : null);
    if (res && res.length > 0) {
      doctorList = res;
    }
  } catch (err) {
    console.warn("Could not fetch /doctors directly, falling back to /users", err);
  }

  // Fallback to /users endpoint (same data source as Super Admin User Management)
  if (!doctorList || doctorList.length === 0) {
    try {
      const users = await api.get<any[]>("/users");
      const doctorUsers = (users || []).filter(
        (u: any) => u.role && String(u.role).toUpperCase().includes("DOCTOR")
      );
      if (doctorUsers.length > 0) {
        doctorList = doctorUsers.map((u: any, idx: number) => {
          const rawName = u.fullName || (u.firstName ? `${u.firstName} ${u.lastName || ""}` : "Doctor");
          const formattedName = rawName.toLowerCase().startsWith("dr.") ? rawName : `Dr. ${rawName}`;
          const seed = Math.abs((u.email || u.id || idx).toString().split("").reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) % 70 + 1;
          return {
            id: u.id || `doc-${idx}`,
            fullName: formattedName,
            email: u.email || "doctor@healthbridge.lk",
            phoneNumber: u.phoneNumber || u.phone || "+94 77 000 0000",
            profileImage: u.picture || `https://i.pravatar.cc/320?img=${seed}`,
            gender: (u.gender || "Other") as any,
            dateOfBirth: u.dateOfBirth || "1985-01-01",
            address: u.address || "Colombo, Sri Lanka",
            specialization: u.specialization && !["genral", "general"].includes(u.specialization.toLowerCase()) ? u.specialization : "General Medicine",
            qualifications: u.qualifications && u.qualifications.length > 0 ? u.qualifications : ["MBBS", "MD"],
            experience: u.experience && u.experience > 0 ? u.experience : 8,
            consultationFee: u.consultationFee && u.consultationFee > 0 ? u.consultationFee : 3500,
            rating: u.rating && u.rating > 0 ? u.rating : 4.9,
            availableToday: true,
            bio: u.bio || "Consultant Specialist at HealthBridge.",
          };
        });
      }
    } catch {
      // ignore
    }
  }

  // Ensure current active doctor profile is included or updated
  if (doctorList.length > 0) {
    const activeEmail = currentProfile.email.toLowerCase().trim();
    const existingIndex = doctorList.findIndex(
      (d) => (d.email && d.email.toLowerCase().trim() === activeEmail) || d.id === currentProfile.id
    );
    if (existingIndex >= 0) {
      doctorList[existingIndex] = { ...doctorList[existingIndex], ...currentProfile };
    } else {
      doctorList.unshift(currentProfile);
    }
    return doctorList;
  }

  return [currentProfile];
}

export async function getAvailability(): Promise<Availability[]> {
  try {
    const res = await api.get<Availability[]>(`/doctors/me/availability?doctorId=${encodeURIComponent(getDoctorId())}`);
    if (res) return res;
  } catch {
    // ignore
  }

  if (typeof window !== "undefined") {
    const user = getStoredUser();
    const email = user?.email?.toLowerCase().trim() || "default";
    const stored = localStorage.getItem(`healthbridge_doctor_availability_${email}`);
    if (stored) {
      try { return JSON.parse(stored); } catch { return []; }
    }
  }

  return [];
}

export async function updateAvailability(slots: AvailabilityInput[]): Promise<Availability[]> {
  const newSlots: Availability[] = slots.map((slot, index) => ({
    ...slot,
    id: `slot-${Date.now()}-${index}`,
  }));

  try {
    await api.put<Availability[]>(`/doctors/me/availability?doctorId=${encodeURIComponent(getDoctorId())}`, slots);
  } catch {
    // fallback local storage update
  }

  if (typeof window !== "undefined") {
    const user = getStoredUser();
    const email = user?.email?.toLowerCase().trim() || "default";
    localStorage.setItem(`healthbridge_doctor_availability_${email}`, JSON.stringify(newSlots));
  }

  return newSlots;
}

const getLeavesKey = () => {
  const user = getStoredUser();
  const email = user?.email?.toLowerCase().trim() || "default";
  return `healthbridge_doctor_leaves_${email}`;
};

export async function createLeave(data: LeaveInput): Promise<DoctorLeave> {
  const doctorId = getDoctorId();
  const user = getStoredUser();
  const email = user?.email || "";

  try {
    const created = await api.post<DoctorLeave>(
      `/doctors/me/leaves?doctorId=${encodeURIComponent(doctorId)}&email=${encodeURIComponent(email)}`,
      data
    );
    if (created && created.id) {
      if (typeof window !== "undefined") {
        const key = getLeavesKey();
        const stored = localStorage.getItem(key);
        let list: DoctorLeave[] = [];
        if (stored) {
          try { list = JSON.parse(stored); } catch { list = []; }
        }
        list = [created, ...list.filter((l) => l.id !== created.id)];
        localStorage.setItem(key, JSON.stringify(list));
      }
      return created;
    }
  } catch (error) {
    console.warn("Backend /doctors/me/leaves POST failed, falling back to local cache:", error);
  }

  // Graceful offline fallback
  const fallbackLeave: DoctorLeave = { 
    ...data, 
    id: `leave-${Date.now()}`, 
    status: "Pending", 
    appliedAt: new Date().toISOString().slice(0, 10) 
  };
  
  if (typeof window !== "undefined") {
    const key = getLeavesKey();
    const stored = localStorage.getItem(key);
    let list: DoctorLeave[] = [];
    if (stored) {
      try { list = JSON.parse(stored); } catch { list = []; }
    }
    list = [fallbackLeave, ...list];
    localStorage.setItem(key, JSON.stringify(list));
  }
  
  return fallbackLeave;
}

export async function getLeaves(): Promise<DoctorLeave[]> {
  try {
    const doctorId = getDoctorId();
    const user = getStoredUser();
    const email = user?.email || "";
    const res = await api.get<DoctorLeave[]>(
      `/doctors/me/leaves?doctorId=${encodeURIComponent(doctorId)}&email=${encodeURIComponent(email)}`
    );
    if (Array.isArray(res)) {
      if (typeof window !== "undefined") {
        const key = getLeavesKey();
        localStorage.setItem(key, JSON.stringify(res));
      }
      return res;
    }
  } catch (error) {
    console.warn("Backend /doctors/me/leaves GET failed, falling back to local cache:", error);
  }

  // Graceful offline fallback
  if (typeof window !== "undefined") {
    const key = getLeavesKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
  }
  return [];
}

export async function getEarnings(): Promise<Earnings> {
  return api.get<Earnings>("/doctors/me/earnings");
}

export const doctorService = {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctors,
  getAvailability,
  updateAvailability,
  createLeave,
  getLeaves,
  getEarnings,
};
