"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AccountSettingsPage() {
  const [accountStatus, setAccountStatus] = useState("Active");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/users/profile")
      .then((res) => {
        setAccountStatus(res.data.accountStatus || "Active");
        setCreatedAt(res.data.createdAt || null);
      })
      .catch(() => setError("Could not load account status."))
      .finally(() => setLoading(false));
  }, []);

  const handleDeactivateClick = () => {
    setShowDeactivateModal(true);
  };

  const confirmDeactivate = async () => {
    setShowDeactivateModal(false);
    setUpdating(true);
    setError("");
    try {
      const res = await api.put("/users/profile/deactivate");
      setAccountStatus(res.data.accountStatus);
    } catch (err) {
      console.error(err);
      setError("Could not deactivate account.");
    } finally {
      setUpdating(false);
    }
  };

  const handleReactivate = async () => {
    setUpdating(true);
    setError("");
    try {
      const res = await api.put("/users/profile/reactivate");
      setAccountStatus(res.data.accountStatus);
    } catch (err) {
      console.error(err);
      setError("Could not reactivate account.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Account Settings">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Account Settings
          </h1>
          {createdAt && (
            <p className="text-sm text-gray-400 mb-8">
              Member since{" "}
              {new Date(createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          {!createdAt && <div className="mb-8" />}

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-6">
              <div>
                <h2 className="font-semibold text-gray-800">
                  Account Status
                </h2>
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
                  onClick={handleDeactivateClick}
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

            <div className="flex items-center justify-between pb-2">
              <div>
                <h2 className="font-semibold text-gray-800">Password</h2>
                <p className="text-sm text-gray-500">
                  Change your password to keep your account secure.
                </p>
              </div>
              <a
                href="/forgot-password"
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded-lg transition"
              >
                Change Password
              </a>
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
      )}

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDeactivateModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Deactivate your account?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              You&apos;ll lose access to your account until you reactivate it.
              This won&apos;t delete any of your data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeactivate}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
