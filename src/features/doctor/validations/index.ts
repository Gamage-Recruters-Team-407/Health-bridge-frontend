import type { AvailabilityInput, DoctorProfileUpdate, LeaveInput } from "../types";

export function validatePhoneNumber(value: string) {
  const phone = value.replace(/[\s()-]/g, "");
  return /^(?:0[1-9]\d{8}|\+94[1-9]\d{8})$/.test(phone)
    ? ""
    : "Enter a valid Sri Lankan phone number, such as 0771234567 or +94771234567.";
}

export function validateProfilePhoto(file: Pick<File, "type" | "size">) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return "Choose a JPG, PNG, or WebP photo.";
  if (file.size > 2 * 1024 * 1024) return "Choose a photo smaller than 2 MB.";
  if (!file.size) return "The selected photo is empty.";
  return "";
}

export function validateProfile(data: DoctorProfileUpdate) {
  if (!data.fullName.trim() || !data.email.trim() || !data.specialization.trim()) return "Name, email, and specialization are required.";
  if (!/^\S+@\S+\.\S+$/.test(data.email)) return "Enter a valid email address.";
  const phoneError = validatePhoneNumber(data.phoneNumber);
  if (phoneError) return phoneError;
  if (data.experience < 0 || data.consultationFee < 0) return "Experience and consultation fee cannot be negative.";
  return "";
}

export function validateAvailability(data: AvailabilityInput) {
  if (!data.date || !data.startTime || !data.endTime) return "Date, start time, and end time are required.";
  if (data.startTime >= data.endTime) return "End time must be later than start time.";
  return "";
}

export function validateLeave(data: LeaveInput) {
  if (!data.startDate || !data.endDate || !data.reason.trim()) return "Complete all leave fields.";
  if (data.endDate < data.startDate) return "End date cannot be before start date.";
  return "";
}
