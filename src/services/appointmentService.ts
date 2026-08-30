import {
  Appointment,
  AppointmentFilters,
  AppointmentFormValues,
  AppointmentSummary,
  CancelAppointmentInput,
  Doctor,
  DoctorAvailabilitySlot,
} from "@/types/appointment";

const APPOINTMENTS_KEY = "healthbridge_appointments";
const PATIENT_ID = "patient-demo-001";

const slotTimes = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
];

const doctors: Doctor[] = [
  {
    id: "doc-001",
    name: "Dr. Robert Chen",
    specialization: "Cardiologist",
    hospital: "Health Bridge Central Hospital",
    consultationFee: 8500,
    rating: 4.9,
    reviews: 120,
    appointmentType: "VIDEO",
    about: "Specializes in preventive cardiology, arrhythmia care, and virtual consultations.",
  },
  {
    id: "doc-002",
    name: "Dr. Maya Perera",
    specialization: "Dermatologist",
    hospital: "Health Bridge Skin Clinic",
    consultationFee: 6500,
    rating: 4.8,
    reviews: 89,
    appointmentType: "IN_PERSON",
    about: "Focuses on chronic skin conditions, acne management, and follow-up care.",
  },
  {
    id: "doc-003",
    name: "Dr. Nimal Jayasuriya",
    specialization: "Orthopedic Surgeon",
    hospital: "Health Bridge Specialist Center",
    consultationFee: 9500,
    rating: 4.7,
    reviews: 74,
    appointmentType: "IN_PERSON",
    about: "Provides joint, spine, and sports injury consultations with scheduled follow-ups.",
  },
  {
    id: "doc-004",
    name: "Dr. Sarah Fernando",
    specialization: "General Physician",
    hospital: "Health Bridge Family Care",
    consultationFee: 5000,
    rating: 4.6,
    reviews: 142,
    appointmentType: "VIDEO",
    about: "Handles first-contact consultations, routine checks, and chronic illness reviews.",
  },
];

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const toDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toIsoString = (date: Date) => {
  return new Date(date).toISOString();
};

const fromDateAndTime = (date: string, time: string) => {
  return new Date(`${date}T${time}:00`);
};

const today = () => toDateString(new Date());

const createSeedAppointments = (): Appointment[] => {
  const now = new Date();
  const seedBase = new Date(now);
  seedBase.setHours(9, 0, 0, 0);

  return [
    {
      id: "APT-1001",
      patientId: PATIENT_ID,
      doctorId: doctors[0].id,
      doctorName: doctors[0].name,
      doctorSpecialization: doctors[0].specialization,
      hospital: doctors[0].hospital,
      appointmentDate: toDateString(addDays(seedBase, 2)),
      appointmentTime: "09:30",
      appointmentType: doctors[0].appointmentType || "VIDEO",
      reason: "Follow-up on irregular heartbeat symptoms",
      status: "UPCOMING",
      createdAt: toIsoString(addDays(seedBase, -3)),
      updatedAt: toIsoString(addDays(seedBase, -1)),
      notes: "Secure telehealth link will open 10 minutes before the appointment.",
    },
    {
      id: "APT-1002",
      patientId: PATIENT_ID,
      doctorId: doctors[1].id,
      doctorName: doctors[1].name,
      doctorSpecialization: doctors[1].specialization,
      hospital: doctors[1].hospital,
      appointmentDate: toDateString(addDays(seedBase, 5)),
      appointmentTime: "14:00",
      appointmentType: doctors[1].appointmentType || "IN_PERSON",
      reason: "Skin allergy consultation",
      status: "UPCOMING",
      createdAt: toIsoString(addDays(seedBase, -4)),
      updatedAt: toIsoString(addDays(seedBase, -2)),
    },
    {
      id: "APT-0990",
      patientId: PATIENT_ID,
      doctorId: doctors[3].id,
      doctorName: doctors[3].name,
      doctorSpecialization: doctors[3].specialization,
      hospital: doctors[3].hospital,
      appointmentDate: toDateString(addDays(seedBase, -10)),
      appointmentTime: "10:00",
      appointmentType: doctors[3].appointmentType || "VIDEO",
      reason: "Routine wellness check",
      status: "COMPLETED",
      createdAt: toIsoString(addDays(seedBase, -18)),
      updatedAt: toIsoString(addDays(seedBase, -10)),
      notes: "General wellness guidance shared after visit.",
    },
    {
      id: "APT-0985",
      patientId: PATIENT_ID,
      doctorId: doctors[2].id,
      doctorName: doctors[2].name,
      doctorSpecialization: doctors[2].specialization,
      hospital: doctors[2].hospital,
      appointmentDate: toDateString(addDays(seedBase, -4)),
      appointmentTime: "15:00",
      appointmentType: doctors[2].appointmentType || "IN_PERSON",
      reason: "Knee pain consultation",
      status: "CANCELLED",
      createdAt: toIsoString(addDays(seedBase, -11)),
      updatedAt: toIsoString(addDays(seedBase, -5)),
      cancelledAt: toIsoString(addDays(seedBase, -5)),
      cancellationReason: "Patient requested a later date.",
    },
  ];
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const getStoredAppointments = (): Appointment[] => {
  if (typeof window === "undefined") {
    return createSeedAppointments();
  }

  const raw = window.localStorage.getItem(APPOINTMENTS_KEY);
  if (!raw) {
    const seed = createSeedAppointments();
    window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    return JSON.parse(raw) as Appointment[];
  } catch {
    const seed = createSeedAppointments();
    window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(seed));
    return seed;
  }
};

const saveAppointments = (appointments: Appointment[]) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  }
};

const normalizeStatus = (appointment: Appointment): Appointment => {
  if (appointment.status !== "UPCOMING") {
    return appointment;
  }

  const appointmentDateTime = fromDateAndTime(
    appointment.appointmentDate,
    appointment.appointmentTime
  );

  if (appointmentDateTime.getTime() < Date.now()) {
    return {
      ...appointment,
      status: "COMPLETED",
      updatedAt: toIsoString(new Date()),
    };
  }

  return appointment;
};

const applyFilters = (appointments: Appointment[], filters?: AppointmentFilters) => {
  const normalized = appointments.map(normalizeStatus);
  let filtered = normalized;

  if (filters?.status && filters.status !== "ALL") {
    filtered = filtered.filter((appointment) => appointment.status === filters.status);
  }

  if (filters?.query?.trim()) {
    const query = filters.query.trim().toLowerCase();
    filtered = filtered.filter((appointment) =>
      [
        appointment.id,
        appointment.doctorName,
        appointment.doctorSpecialization,
        appointment.reason,
        appointment.hospital,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query))
    );
  }

  return filtered.sort((a, b) => {
    const aTime = fromDateAndTime(a.appointmentDate, a.appointmentTime).getTime();
    const bTime = fromDateAndTime(b.appointmentDate, b.appointmentTime).getTime();
    return aTime - bTime;
  });
};

const appointmentExistsAtSlot = (
  appointments: Appointment[],
  doctorId: string,
  date: string,
  time: string,
  ignoreAppointmentId?: string
) => {
  return appointments.some(
    (appointment) =>
      appointment.id !== ignoreAppointmentId &&
      appointment.doctorId === doctorId &&
      appointment.appointmentDate === date &&
      appointment.appointmentTime === time &&
      appointment.status === "UPCOMING"
  );
};

const createAvailabilitySlots = (
  doctorId: string,
  date: string,
  appointments: Appointment[],
  ignoreAppointmentId?: string
): DoctorAvailabilitySlot[] => {
  const selectedDate = new Date(`${date}T00:00:00`);
  const weekday = selectedDate.getDay();

  return slotTimes.map((time, index) => {
    const isWeekendBlock = weekday === 0;
    const isDoctorBreak = doctorId === "doc-001" && (time === "11:00" || time === "15:30");
    const isPatternBlocked = (weekday + index + doctorId.length) % 4 === 0;
    const isBooked = appointmentExistsAtSlot(
      appointments,
      doctorId,
      date,
      time,
      ignoreAppointmentId
    );

    const isAvailable =
      !isWeekendBlock && !isDoctorBreak && !isPatternBlocked && !isBooked;

    return {
      id: `${doctorId}-${date}-${time}`,
      time,
        label: formatTimeLabel(time),
        isAvailable,
      };
    });
};

const formatTimeLabel = (time: string) => {
  const [hoursRaw, minutes] = time.split(":");
  const hours = Number(hoursRaw);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = ((hours + 11) % 12) + 1;
  return `${normalizedHours}:${minutes} ${suffix}`;
};

const validateBooking = (
  appointments: Appointment[],
  values: AppointmentFormValues,
  ignoreAppointmentId?: string
) => {
  if (!values.appointmentDate) {
    throw new Error("Please select an appointment date.");
  }

  if (values.appointmentDate < today()) {
    throw new Error("Appointments cannot be booked for a past date.");
  }

  if (!values.appointmentTime) {
    throw new Error("Please select an available time slot.");
  }

  const doctor = doctors.find((item) => item.id === values.doctorId);
  if (!doctor) {
    throw new Error("Please select a doctor.");
  }

  const slots = createAvailabilitySlots(
    values.doctorId,
    values.appointmentDate,
    appointments,
    ignoreAppointmentId
  );
  const selectedSlot = slots.find((slot) => slot.time === values.appointmentTime);

  if (!selectedSlot?.isAvailable) {
    throw new Error("This doctor is not available at the selected time.");
  }
};

const delay = async () => {
  if (typeof window === "undefined") {
    return;
  }
  await new Promise((resolve) => window.setTimeout(resolve, 120));
};

export const appointmentService = {
  async getAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
    await delay();
    const appointments = getStoredAppointments();
    const normalized = appointments.map(normalizeStatus);
    saveAppointments(normalized);
    return clone(applyFilters(normalized, filters));
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    await delay();
    const appointment = getStoredAppointments()
      .map(normalizeStatus)
      .find((item) => item.id === id);

    if (!appointment) {
      throw new Error("Appointment not found.");
    }

    return clone(appointment);
  },

  async getSummary(): Promise<AppointmentSummary> {
    const appointments = await this.getAppointments();
    return {
      upcoming: appointments.filter((item) => item.status === "UPCOMING").length,
      completed: appointments.filter((item) => item.status === "COMPLETED").length,
      cancelled: appointments.filter((item) => item.status === "CANCELLED").length,
    };
  },

  async searchDoctors(query = ""): Promise<Doctor[]> {
    await delay();
    const term = query.trim().toLowerCase();

    if (!term) {
      return clone(doctors);
    }

    return clone(
      doctors.filter((doctor) =>
        [doctor.name, doctor.specialization, doctor.hospital]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(term))
      )
    );
  },

  async getDoctorById(id: string): Promise<Doctor> {
    await delay();
    const doctor = doctors.find((item) => item.id === id);
    if (!doctor) {
      throw new Error("Doctor not found.");
    }
    return clone(doctor);
  },

  async getDoctorAvailability(
    doctorId: string,
    date: string,
    ignoreAppointmentId?: string
  ): Promise<DoctorAvailabilitySlot[]> {
    await delay();

    if (!date) {
      return [];
    }

    if (date < today()) {
      throw new Error("Appointments cannot be booked for a past date.");
    }

    const doctor = doctors.find((item) => item.id === doctorId);
    if (!doctor) {
      throw new Error("Doctor not found.");
    }

    const appointments = getStoredAppointments().map(normalizeStatus);
    return clone(createAvailabilitySlots(doctorId, date, appointments, ignoreAppointmentId));
  },

  async createAppointment(values: AppointmentFormValues): Promise<Appointment> {
    await delay();
    const appointments = getStoredAppointments().map(normalizeStatus);
    validateBooking(appointments, values);

    const doctor = doctors.find((item) => item.id === values.doctorId)!;
    const now = new Date();
    const appointment: Appointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: PATIENT_ID,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      hospital: doctor.hospital,
      appointmentDate: values.appointmentDate,
      appointmentTime: values.appointmentTime,
      appointmentType: doctor.appointmentType || "IN_PERSON",
      reason: values.reason.trim(),
      status: "UPCOMING",
      createdAt: toIsoString(now),
      updatedAt: toIsoString(now),
      notes:
        doctor.appointmentType === "VIDEO"
          ? "Meeting room opens 10 minutes before the scheduled time."
          : "Please arrive 15 minutes early for registration.",
    };

    const nextAppointments = [...appointments, appointment];
    saveAppointments(nextAppointments);
    return clone(appointment);
  },

  async rescheduleAppointment(
    appointmentId: string,
    values: AppointmentFormValues
  ): Promise<Appointment> {
    await delay();
    const appointments = getStoredAppointments().map(normalizeStatus);
    const current = appointments.find((item) => item.id === appointmentId);

    if (!current) {
      throw new Error("Appointment not found.");
    }

    if (current.status !== "UPCOMING") {
      throw new Error("Only upcoming appointments can be rescheduled.");
    }

    validateBooking(appointments, values, appointmentId);

    const updated = appointments.map((item) =>
      item.id === appointmentId
        ? {
            ...item,
            appointmentDate: values.appointmentDate,
            appointmentTime: values.appointmentTime,
            reason: values.reason.trim(),
            updatedAt: toIsoString(new Date()),
          }
        : item
    );

    saveAppointments(updated);
    return clone(updated.find((item) => item.id === appointmentId)!);
  },

  async cancelAppointment({
    appointmentId,
    reason,
  }: CancelAppointmentInput): Promise<Appointment> {
    await delay();
    const appointments = getStoredAppointments().map(normalizeStatus);
    const current = appointments.find((item) => item.id === appointmentId);

    if (!current) {
      throw new Error("Appointment not found.");
    }

    if (current.status !== "UPCOMING") {
      throw new Error("Only upcoming appointments can be cancelled.");
    }

    const updated = appointments.map((item) =>
      item.id === appointmentId
        ? {
            ...item,
            status: "CANCELLED" as const,
            cancellationReason: reason?.trim() || "Cancelled by patient.",
            cancelledAt: toIsoString(new Date()),
            updatedAt: toIsoString(new Date()),
          }
        : item
    );

    saveAppointments(updated);
    return clone(updated.find((item) => item.id === appointmentId)!);
  },
};

export const appointmentMockData = {
  doctors,
};
