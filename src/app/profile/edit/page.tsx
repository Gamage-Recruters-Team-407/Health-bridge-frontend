"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, matches backend limit

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });
  const [picture, setPicture] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [error, setError] = useState("");
  const [pictureError, setPictureError] = useState("");

  useEffect(() => {
    api
      .get("/users/profile")
      .then((res) => {
        setFormData({
          fullName: res.data.fullName || "",
          phoneNumber: res.data.phoneNumber || "",
        });
        setPicture(res.data.picture || "");
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPictureError("");

    if (!file.type.startsWith("image/")) {
      setPictureError("Please choose an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setPictureError("Image must be smaller than 5MB.");
      e.target.value = "";
      return;
    }

    // Show an instant local preview while the upload is in progress
    const localPreviewUrl = URL.createObjectURL(file);
    setPicture(localPreviewUrl);
    setUploadingPicture(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await api.post("/users/profile/picture", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPicture(res.data.picture || "");
    } catch (err) {
      console.error(err);
      setPictureError("Could not upload picture. Please try again.");
      setPicture((prev) => (prev === localPreviewUrl ? "" : prev));
    } finally {
      URL.revokeObjectURL(localPreviewUrl);
      setUploadingPicture(false);
      e.target.value = "";
    }
  };

  const handleRemovePicture = async () => {
    setPictureError("");
    setUploadingPicture(true);
    try {
      const res = await api.delete("/users/profile/picture");
      setPicture(res.data.picture || "");
    } catch (err) {
      console.error(err);
      setPictureError("Could not remove picture. Please try again.");
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put("/users/profile", {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      });
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError("Could not update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const initials = formData.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Edit Profile</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <button
              type="button"
              onClick={handlePictureClick}
              disabled={uploadingPicture}
              className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition disabled:opacity-60"
              aria-label="Change profile picture"
            >
              {picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={picture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-gray-500">
                  {initials || "?"}
                </span>
              )}

              {uploadingPicture && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                  <span className="text-white text-xs">Uploading...</span>
                </div>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="hidden"
            />
          </div>

          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={handlePictureClick}
              disabled={uploadingPicture}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-60"
            >
              Change Photo
            </button>

            {picture && (
              <button
                type="button"
                onClick={handleRemovePicture}
                disabled={uploadingPicture}
                className="text-sm text-red-500 hover:text-red-600 font-medium disabled:opacity-60"
              >
                Remove Photo
              </button>
            )}
          </div>

          {pictureError && (
            <p className="text-red-500 text-xs mt-2">{pictureError}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Phone</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <a
              href="/profile"
              className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-lg transition"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
