"use client";

import { useState } from "react";

export default function AccountSettingsPage() {
  const [accountStatus, setAccountStatus] = useState("Active");
  const [notifications, setNotifications] = useState(true);

  const handleDeactivate = () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account?"
    );
    if (confirmed) {
      setAccountStatus("Inactive");
      // TODO: connect to backend API later
      console.log("Account deactivated");
    }
  };

  const handleReactivate = () => {
    setAccountStatus("Active");
    // TODO: connect to backend API later
    console.log("Account reactivated");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Account Settings
        </h1>

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
                className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg transition"
              >
                Deactivate
              </button>
            ) : (
              <button
                onClick={handleReactivate}
                className="bg-green-50 hover:bg-green-100 text-green-600 font-medium px-4 py-2 rounded-lg transition"
              >
                Reactivate
              </button>
            )}
          </div>

          <div className="flex items-center justify-between border-b pb-6">
            <div>
              <h2 className="font-semibold text-gray-800">Notifications</h2>
              <p className="text-sm text-gray-500">
                Receive email and app notifications
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition relative ${
                notifications ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">Change Password</h2>
              <p className="text-sm text-gray-500">
                Update your account password
              </p>
            </div>
            <a
              href="/account/security"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg transition"
            >
              Change
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
    </div>
  );
}
