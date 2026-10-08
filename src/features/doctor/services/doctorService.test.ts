import { beforeEach, describe, expect, it, vi } from "vitest";

const { get, put } = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn() }));
vi.mock("@/lib/axios", () => ({ default: { get, put }, getApiErrorMessage: (_error: unknown, fallback: string) => fallback }));
vi.mock("@/lib/auth", () => ({ getStoredUser: () => null }));

import { getDoctors, updateDoctorProfile } from "./doctorService";
import type { DoctorProfileUpdate } from "../types";

beforeEach(() => { get.mockReset(); put.mockReset(); });

describe("doctor directory fallback", () => {
  it("does not report a successful save when the backend times out", async () => {
    put.mockRejectedValue(new Error("Timeout"));
    await expect(updateDoctorProfile({} as DoctorProfileUpdate)).rejects.toThrow("Unable to save your profile");
  });
  it("returns a resolved doctor when directory and profile requests fail", async () => {
    get.mockRejectedValue(new Error("Network unavailable"));
    const doctors = await getDoctors();
    expect(doctors).toHaveLength(1);
    expect(doctors[0]).not.toBeInstanceOf(Promise);
    expect(doctors[0].id).toBeTruthy();
    expect(() => doctors[0].consultationFee.toLocaleString()).not.toThrow();
    expect(Array.isArray(doctors[0].qualifications)).toBe(true);
  });

  it("awaits the profile when the directory is empty", async () => {
    const profile = { id: "doctor-1", consultationFee: 3000, qualifications: ["MBBS"] };
    get.mockResolvedValueOnce([]).mockResolvedValueOnce(profile);
    expect(await getDoctors()).toEqual([profile]);
  });
});
