"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  picture: string;
  accountStatus: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/users/profile")
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        setError("Could not load profile. Please log in again.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || "Profile not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.accountStatus === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.accountStatus || "Active"}
          </span>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold text-gray-500 overflow-hidden">
            {user.picture ? (
              <img
                src={user.picture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              user.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
            )}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {user.fullName}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-500">Email</span>
            <span className="text-gray-800 font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-500">Phone</span>
            <span className="text-gray-800 font-medium">
              {user.phoneNumber || "Not set"}
            </span>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <a
            href="/profile/edit"
            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            Edit Profile
          </a>
          <a
            href="/profile/settings"
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-lg transition"
          >
            Account Settings
          </a>
        </div>
      </div>
    </div>
  );
}
