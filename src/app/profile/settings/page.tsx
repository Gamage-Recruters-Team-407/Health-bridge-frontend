"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// ---- Types ----
type NotificationPrefs = {
  email: boolean;
  sms: boolean;
  push: boolean;
};

type PrivacyPrefs = {
  profileVisibility: "public" | "doctors_only" | "private";
  shareDataForResearch: boolean;
};

type LocalizationPrefs = {
  language: string;
  timezone: string;
};

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "si", label: "\u0dc3\u0dd2\u0d82\u0dc4\u0dbd (Sinhala)" },
  { code: "ta", label: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd (Tamil)" },
];

const TIMEZONES = [
  "Asia/Colombo",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Europe/London",
  "UTC",
];

// Small reusable toggle switch
function ToggleSwitch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition disabled:opacity-50 ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function AccountSettingsPage() {
  // Account status
  const [accountStatus, setAccountStatus] = useState("Active");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // 2FA
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [savingTwoFactor, setSavingTwoFactor] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationPrefs>({
    email: true,
    sms: false,
    push: true,
  });
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Privacy
  const [privacy, setPrivacy] = useState<PrivacyPrefs>({
    profileVisibility: "doctors_only",
    shareDataForResearch: false,
  });
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Localization
  const [localization, setLocalization] = useState<LocalizationPrefs>({
    language: "en",
    timezone: "Asia/Colombo",
  });
  const [savingLocalization, setSavingLocalization] = useState(false);

  // Shared state
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    api
      .get<any>("/users/profile")
      .then((data) => {
        setAccountStatus(data.accountStatus || "Active");
        setCreatedAt(data.createdAt || null);
        setTwoFactorEnabled(!!data.twoFactorEnabled);
        setNotifications({
          email: data.notificationPrefs?.email ?? true,
          sms: data.notificationPrefs?.sms ?? false,
          push: data.notificationPrefs?.push ?? true,
        });
        setPrivacy({
          profileVisibility: data.privacyPrefs?.profileVisibility ?? "doctors_only",
          shareDataForResearch: data.privacyPrefs?.shareDataForResearch ?? false,
        });
        setLocalization({
          language: data.localizationPrefs?.language ?? "en",
          timezone: data.localizationPrefs?.timezone ?? "Asia/Colombo",
        });
      })
      .catch(() => setError("Could not load account settings."))
      .finally(() => setLoading(false));
  }, []);

  function flashSuccess(msg: string) {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  }

  // ---- Account status handlers ----
  const handleDeactivateClick = () => setShowDeactivateModal(true);

  const confirmDeactivate = async () => {
    setShowDeactivateModal(false);
    setUpdating(true);
    setError("");
    try {
      const data = await api.put<any>("/users/profile/deactivate");
      setAccountStatus(data.accountStatus);
      flashSuccess("Account deactivated.");
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
      flashSuccess("Account reactivated.");
    } catch (err) {
      console.error(err);
      setError("Could not reactivate account.");
    } finally {
      setUpdating(false);
    }
  };

  // ---- 2FA handler ----
  const handleToggleTwoFactor = async () => {
    const nextValue = !twoFactorEnabled;
    setSavingTwoFactor(true);
    setError("");
    try {
      await api.put("/users/profile/2fa", { enabled: nextValue });
      setTwoFactorEnabled(nextValue);
      flashSuccess(
        nextValue ? "Two-factor authentication enabled." : "Two-factor authentication disabled."
      );
    } catch (err) {
      console.error(err);
      setError("Could not update two-factor authentication.");
    } finally {
      setSavingTwoFactor(false);
    }
  };

  // ---- Notifications handlers ----
  const handleToggleNotification = (key: keyof NotificationPrefs) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    setError("");
    try {
      await api.put("/users/profile/notifications", notifications);
      flashSuccess("Notification preferences saved.");
    } catch (err) {
      console.error(err);
      setError("Could not save notification preferences.");
    } finally {
      setSavingNotifications(false);
    }
  };

  // ---- Privacy handlers ----
  const handlePrivacyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPrivacy((prev) => ({
      ...prev,
      profileVisibility: e.target.value as PrivacyPrefs["profileVisibility"],
    }));
  };

  const handleToggleDataSharing = () => {
    setPrivacy((prev) => ({
      ...prev,
      shareDataForResearch: !prev.shareDataForResearch,
    }));
  };

  const handleSavePrivacy = async () => {
    setSavingPrivacy(true);
    setError("");
    try {
      await api.put("/users/profile/privacy", privacy);
      flashSuccess("Privacy settings saved.");
    } catch (err) {
      console.error(err);
      setError("Could not save privacy settings.");
    } finally {
      setSavingPrivacy(false);
    }
  };

  // ---- Localization handlers ----
  const handleLocalizationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalization((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveLocalization = async () => {
    setSavingLocalization(true);
    setError("");
    try {
      await api.put("/users/profile/localization", localization);
      flashSuccess("Language and timezone updated.");
    } catch (err) {
      console.error(err);
      setError("Could not save localization settings.");
    } finally {
      setSavingLocalization(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Account Settings">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Account Settings
            </h1>
            {createdAt && (
              <p className="text-sm text-gray-400">
                Member since{" "}
                {new Date(createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* ---- Login & Security ---- */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Login &amp; Security
            </h2>

            <div className="flex items-center justify-between border-b pb-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-800">Account Status</h3>
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

            <div className="flex items-center justify-between border-b pb-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-800">Password</h3>
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

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">
                  Two-Factor Authentication (2FA)
                </h3>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security with an OTP sent to your phone or email.
                </p>
              </div>
              <ToggleSwitch
                checked={twoFactorEnabled}
                onChange={handleToggleTwoFactor}
                disabled={savingTwoFactor}
              />
            </div>
          </section>

          {/* ---- Notification Preferences ---- */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Notification Preferences
            </h2>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Email</h3>
                  <p className="text-sm text-gray-500">
                    Appointment reminders, lab results, and account updates.
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.email}
                  onChange={() => handleToggleNotification("email")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">SMS</h3>
                  <p className="text-sm text-gray-500">
                    Urgent alerts sent directly to your phone.
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.sms}
                  onChange={() => handleToggleNotification("sms")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Push Notifications</h3>
                  <p className="text-sm text-gray-500">
                    In-app and browser notifications.
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.push}
                  onChange={() => handleToggleNotification("push")}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveNotifications}
                disabled={savingNotifications}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition disabled:opacity-50"
              >
                {savingNotifications ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </section>

          {/* ---- Privacy ---- */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Privacy</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Visibility
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Control who can view your profile and medical history summary.
              </p>
              <select
                value={privacy.profileVisibility}
                onChange={handlePrivacyChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="doctors_only">Doctors &amp; hospital staff only</option>
                <option value="private">Only me</option>
                <option value="public">Public (visible to all HealthBridge users)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">
                  Share anonymized data for research
                </h3>
                <p className="text-sm text-gray-500">
                  Helps improve healthcare outcomes. Your identity is never shared.
                </p>
              </div>
              <ToggleSwitch
                checked={privacy.shareDataForResearch}
                onChange={handleToggleDataSharing}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSavePrivacy}
                disabled={savingPrivacy}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition disabled:opacity-50"
              >
                {savingPrivacy ? "Saving..." : "Save Privacy Settings"}
              </button>
            </div>
          </section>

          {/* ---- Localization ---- */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Language &amp; Region
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  name="language"
                  value={localization.language}
                  onChange={handleLocalizationChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={localization.timezone}
                  onChange={handleLocalizationChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveLocalization}
                disabled={savingLocalization}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition disabled:opacity-50"
              >
                {savingLocalization ? "Saving..." : "Save Language & Region"}
              </button>
            </div>
          </section>

          <a
            href="/profile"
            className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-lg transition"
          >
            Back to Profile
          </a>
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
