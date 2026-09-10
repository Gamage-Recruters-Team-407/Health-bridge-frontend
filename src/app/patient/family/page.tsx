"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, AuthUser } from "@/lib/auth";
import { Navbar } from "@/components/ui/Navbar";
import { Users, UserPlus, X, Trash2, Mail, Edit2 } from "lucide-react";
import api from "@/lib/axios";

export default function FamilyPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    relationship: "Child",
    dateOfBirth: "",
    linkedEmail: ""
  });

  // Live Field-Level Validation State
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    dob: "",
    email: ""
  });

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(storedUser);
      fetchFamilyMembers(storedUser.id);
    }
  }, [router]);

  const fetchFamilyMembers = async (patientId: string) => {
    try {
      const res = await api.get(`/family-members/patient/${patientId}`);
      setFamilyMembers(res.data);
    } catch (err) {
      console.error("Failed to load family members", err);
    } finally {
      setLoading(false);
    }
  };

  // Live Validation Logic
  const validateField = (field: string, value: string) => {
    let errorMsg = "";
    
    if (field === "name") {
      if (!value.trim()) {
        errorMsg = "Name is required.";
      } else if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
        errorMsg = "Name must be 2-50 characters (letters only).";
      }
    }
    
    if (field === "dob") {
      if (!value) {
        errorMsg = "Date of Birth is required.";
      } else {
        const selected = new Date(value);
        const now = new Date();
        const age = now.getFullYear() - selected.getFullYear();
        if (selected > now) {
          errorMsg = "Date of Birth cannot be in the future.";
        } else if (age > 120) {
          errorMsg = "Date of Birth cannot exceed 120 years.";
        }
      }
    }
    
    if (field === "email") {
      if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMsg = "Please enter a valid email address.";
      }
    }
    
    return errorMsg;
  };

  const handleEdit = (member: any) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      relationship: member.relationship,
      dateOfBirth: member.dateOfBirth,
      linkedEmail: member.linkedEmail || ""
    });
    setFieldErrors({ name: "", dob: "", email: "" });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final safety check before submission
    const nameErr = validateField("name", formData.name);
    const dobErr = validateField("dob", formData.dateOfBirth);
    const emailErr = validateField("email", formData.linkedEmail);
    
    if (nameErr || dobErr || emailErr) {
      setFieldErrors({ name: nameErr, dob: dobErr, email: emailErr });
      return;
    }

    try {
      if (editingId) {
        await api.put(`/family-members/${editingId}`, { ...formData, primaryPatientId: user?.id });
      } else {
        await api.post("/family-members", { ...formData, primaryPatientId: user?.id });
      }
      
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: "", relationship: "Child", dateOfBirth: "", linkedEmail: "" });
      setFieldErrors({ name: "", dob: "", email: "" });
      if (user) fetchFamilyMembers(user.id);
    } catch (err) {
      alert(editingId ? "Failed to update family member." : "Failed to add family member.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this family member?")) return;
    try {
      await api.delete(`/family-members/${id}`);
      if (user) fetchFamilyMembers(user.id);
    } catch (err) {
      alert("Failed to delete family member.");
    }
  };

  // Determine if the form is valid enough to enable the submit button
  const isFormValid = formData.name.trim() !== "" && 
                      formData.dateOfBirth !== "" && 
                      !fieldErrors.name && 
                      !fieldErrors.dob && 
                      !fieldErrors.email;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar title="Family Members" userName={user?.fullName || "User"} userRole={user?.role || "PATIENT"} />

      <main className="flex-1 p-6 sm:p-10 w-full relative">
        <div className="max-w-6xl mx-auto w-full pb-10">
          {/* Beautiful Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 mb-8 text-white shadow-lg shadow-blue-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 flex items-center gap-5 mb-6 sm:mb-0">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1 tracking-tight">Family Members</h1>
                <p className="text-blue-100 text-sm max-w-sm font-medium">Manage profiles for your children, spouse, or elderly parents securely.</p>
              </div>
            </div>
            
            <button 
              onClick={() => { 
                setEditingId(null); 
                setFormData({ name: "", relationship: "Child", dateOfBirth: "", linkedEmail: "" });
                setFieldErrors({ name: "", dob: "", email: "" });
                setShowModal(true); 
              }}
              className="relative z-10 bg-white text-blue-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 hover:scale-105 transition-all shadow-md flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" /> Add Family Member
            </button>
          </div>

          {familyMembers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="bg-slate-100 p-6 rounded-full mb-6">
                <Users className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No family members linked</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                Add dependents like children or elderly parents to easily manage their healthcare from one central account.
              </p>
              <button 
                onClick={() => { 
                  setEditingId(null); 
                  setFormData({ name: "", relationship: "Child", dateOfBirth: "", linkedEmail: "" });
                  setFieldErrors({ name: "", dob: "", email: "" });
                  setShowModal(true); 
                }}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyMembers.map((member) => (
                <div key={member.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 transition group relative">
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button 
                      onClick={() => handleEdit(member)}
                      className="text-slate-300 hover:text-blue-500 transition p-1"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="text-slate-300 hover:text-red-500 transition p-1"
                      title="Remove Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-4">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{member.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">
                      {member.relationship}
                    </span>
                    <span className="text-sm text-slate-500">DOB: {member.dateOfBirth}</span>
                  </div>
                  {member.linkedEmail && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-500">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {member.linkedEmail}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {editingId ? "Edit Family Member" : "Add Family Member"}
              </h2>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" required placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, name: val });
                      setFieldErrors({ ...fieldErrors, name: validateField("name", val) });
                    }}
                    className={`w-full p-3.5 rounded-xl border outline-none transition ${
                      fieldErrors.name ? 'border-red-500 focus:ring-2 focus:ring-red-500/30 bg-red-50/30' : 'border-slate-200 focus:ring-2 focus:ring-blue-600/30'
                    }`}
                  />
                  {fieldErrors.name && <p className="text-red-500 text-xs font-semibold mt-1.5">{fieldErrors.name}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Relationship</label>
                    <select 
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30 outline-none transition bg-white"
                    >
                      <option>Child</option>
                      <option>Spouse</option>
                      <option>Parent</option>
                      <option>Sibling</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
                    <input 
                      type="date" required 
                      value={formData.dateOfBirth}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, dateOfBirth: val });
                        setFieldErrors({ ...fieldErrors, dob: validateField("dob", val) });
                      }}
                      className={`w-full p-3.5 rounded-xl border outline-none transition ${
                        fieldErrors.dob ? 'border-red-500 focus:ring-2 focus:ring-red-500/30 bg-red-50/30' : 'border-slate-200 focus:ring-2 focus:ring-blue-600/30'
                      }`}
                    />
                    {fieldErrors.dob && <p className="text-red-500 text-xs font-semibold mt-1.5">{fieldErrors.dob}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Linked Email (Optional)</label>
                  <input 
                    type="email" placeholder="patient@example.com"
                    value={formData.linkedEmail}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, linkedEmail: val });
                      setFieldErrors({ ...fieldErrors, email: validateField("email", val) });
                    }}
                    className={`w-full p-3.5 rounded-xl border outline-none transition ${
                      fieldErrors.email ? 'border-red-500 focus:ring-2 focus:ring-red-500/30 bg-red-50/30' : 'border-slate-200 focus:ring-2 focus:ring-blue-600/30'
                    }`}
                  />
                  {fieldErrors.email ? (
                    <p className="text-red-500 text-xs font-semibold mt-1.5">{fieldErrors.email}</p>
                  ) : (
                    <p className="text-xs text-slate-500 mt-2">Enter an email if you want to link an existing registered patient account.</p>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  disabled={!isFormValid}
                  className={`w-full py-4 rounded-xl font-bold mt-4 transition shadow-sm ${
                    isFormValid 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {editingId ? "Save Changes" : "Save Family Member"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
