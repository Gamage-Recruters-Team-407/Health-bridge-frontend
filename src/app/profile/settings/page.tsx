"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function AccountSettingsPage() {
  const [accountStatus, setAccountStatus] = useState("Active");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<any>("/users/profile")
      .then((data) => setAccountStatus(data.accountStatus || "Active"))
      .catch(() => setError("Could not load account status."))
      .finally(() => setLoading(false));
  }, []);

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate your account?")) return;
    setUpdating(true);
    setError("");
    try {
      const data = await api.put<any>("/users/profile/deactivate");
      setAccountStatus(data.accountStatus);
    } catch (err) {
      console.error(err);
      setError("Failed to deactivate account.");
    } finally {
      setUpdating(false);
    }
  };

  const handleReactivate = async () => {
    setUpdating(true);
    setError("");
    try {
      const data = await api.put<any>("/users/profile/reactivate");
      setAccountStatus(data.accountStatus);
    } catch (err) {
      console.error(err);
      setError("Could not reactivate account.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Account Settings
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-6">
            <div>
              <h2 className="font-semibold text-gray-800">Account Status</h2>
              <p className="text-sm text-gray-500">
                Your account is currently{" "}
                <span
                  className={
                    accountStatus === "Active"
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {accountStatus}
                </span>
              </p>
            </div>
            {accountStatus === "Active" ? (
              <button
                onClick={handleDeactivate}
                disabled={updating}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {updating ? "Updating..." : "Deactivate"}
              </button>
            ) : (
              <button
                onClick={handleReactivate}
                disabled={updating}
                className="bg-green-50 hover:bg-green-100 text-green-600 font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {updating ? "Updating..." : "Reactivate"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-10">
          <a
            href="/profile"
            className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-lg transition"
          >
            Back to Profile
          </a>
        </div>
      </div>
    </div>
  );
}
