"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { 
  ArrowLeft, Shield, Save, ShieldAlert, Check
} from "lucide-react";
import { superAdminService } from "@/services/superadmin.service";
import toast from "react-hot-toast";

const MODULES = [
  "User Management",
  "Patient Records",
  "Pharmacy & Inventory",
  "Laboratory",
  "Insurance Claims",
  "Appointments",
  "Billing & Invoicing",
  "System Settings"
];

const INITIAL_PERMISSIONS = MODULES.map(moduleName => ({
  moduleName,
  canView: false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canApprove: false,
  canExport: false,
  canManage: false
}));

const FormGroup = ({ label, required, children }: { label: string, required?: boolean, children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-bold text-[#0A2540]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export default function AddRolePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [roleData, setRoleData] = useState({
    name: "",
    type: "Custom Role",
    status: "Active"
  });

  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);

  const handlePermissionChange = (index: number, field: string) => {
    const updated = [...permissions];
    updated[index] = { ...updated[index], [field]: !updated[index][field as keyof typeof updated[0]] };
    setPermissions(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleData.name) {
      toast.error("Role Name is required");
      return;
    }

    try {
      setSaving(true);
      // Create Role with embedded permissions
      const rolePayload = {
        roleId: `ROLE-${roleData.type === 'System Role' ? 'SYS' : 'CUS'}-${Math.floor(Math.random() * 10000)}`,
        name: roleData.name,
        type: roleData.type === 'System Role' ? 'SYSTEM' : 'CUSTOM',
        status: roleData.status ? roleData.status.toUpperCase() : 'ACTIVE',
        permissions: permissions.map(p => ({
          moduleName: p.moduleName,
          canView: p.canView,
          canCreate: p.canCreate,
          canEdit: p.canEdit,
          canDelete: p.canDelete,
          canApprove: p.canApprove,
          canExport: p.canExport,
          canManage: p.canManage
        })),
        riskLevel: "LOW", // simplified for now
        riskRecommendations: ""
      };

      await superAdminService.createRole(rolePayload);
      
      toast.success("Role created successfully!");
      router.push("/super-admin/roles");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create role");
    } finally {
      setSaving(false);
    }
  };

  const renderCheckbox = (checked: boolean, onChange: () => void, danger?: boolean) => {
    return (
      <button 
        type="button"
        onClick={onChange}
        className={`w-4 h-4 rounded flex items-center justify-center transition-colors border-2 ${
          checked 
            ? danger 
              ? 'bg-red-600 border-red-600' 
              : 'bg-[#0052CC] border-[#0052CC]'
            : 'bg-white border-slate-300 hover:border-[#0052CC]'
        }`}
      >
        {checked && <Check size={12} className="text-white" strokeWidth={3} />}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/super-admin/roles">
            <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-[24px] font-bold text-[#0A2540] tracking-tight">Create New Role</h1>
            <p className="text-sm font-medium text-slate-500">Configure basic details and access permissions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/super-admin/roles">
            <Button variant="outline" className="font-bold border-slate-200 bg-white">
              Cancel
            </Button>
          </Link>
          <Button 
            onClick={handleSave} 
            isLoading={saving}
            variant="primary" 
            leftIcon={<Save size={16} />} 
            className="font-bold bg-[#0052CC] hover:bg-blue-700 shadow-sm px-6"
          >
            Save Role
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Basic Details */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="p-6 rounded-2xl border border-slate-200 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <Shield size={18} className="text-[#0052CC]" />
              <h2 className="text-base font-bold text-[#0A2540]">Role Details</h2>
            </div>
            
            <form className="space-y-5" onSubmit={handleSave}>
              <FormGroup label="Role Name" required>
                <Input 
                  placeholder="e.g. Senior Nurse" 
                  value={roleData.name}
                  onChange={(e) => setRoleData({...roleData, name: e.target.value})}
                />
              </FormGroup>

              <FormGroup label="Role Type">
                <select 
                  className="w-full h-11 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0052CC] shadow-sm"
                  value={roleData.type}
                  onChange={(e) => setRoleData({...roleData, type: e.target.value})}
                >
                  <option value="System Role">System Role (Built-in)</option>
                  <option value="Custom Role">Custom Role</option>
                </select>
              </FormGroup>

              <FormGroup label="Initial Status">
                <select 
                  className="w-full h-11 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0052CC] shadow-sm"
                  value={roleData.status}
                  onChange={(e) => setRoleData({...roleData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </FormGroup>
            </form>
          </Card>

          <Card className="p-6 rounded-2xl border border-blue-100 bg-blue-50/50 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert size={16} className="text-[#0052CC]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0A2540] mb-1">AI Permission Insights</h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  As you configure permissions, our AI will automatically analyze the matrix for potential Security Risks or Segregation of Duties (SoD) violations.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Permission Matrix */}
        <div className="xl:col-span-2">
          <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden h-full flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#0A2540] mb-1">Permission Matrix</h2>
                <p className="text-xs font-medium text-slate-500">Configure exact module access levels below.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#0052CC]"></div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Granted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border border-slate-200 bg-slate-50"></div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Denied</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="py-4 pl-6 text-[12px] font-bold text-slate-500 uppercase tracking-wider w-[25%]">Module</th>
                    <th className="py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider text-center">View</th>
                    <th className="py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider text-center">Create</th>
                    <th className="py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider text-center">Edit</th>
                    <th className="py-4 text-[12px] font-bold text-red-500 uppercase tracking-wider text-center">Delete</th>
                    <th className="py-4 text-[12px] font-bold text-amber-500 uppercase tracking-wider text-center">Approve</th>
                    <th className="py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider text-center">Export</th>
                    <th className="py-4 pr-6 text-[12px] font-bold text-[#0052CC] uppercase tracking-wider text-center">Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm, idx) => (
                    <tr key={perm.moduleName} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pl-6 text-[13px] font-bold text-[#0A2540]">{perm.moduleName}</td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center">{renderCheckbox(perm.canView, () => handlePermissionChange(idx, 'canView'))}</div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center">{renderCheckbox(perm.canCreate, () => handlePermissionChange(idx, 'canCreate'))}</div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center">{renderCheckbox(perm.canEdit, () => handlePermissionChange(idx, 'canEdit'))}</div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center">{renderCheckbox(perm.canDelete, () => handlePermissionChange(idx, 'canDelete'), true)}</div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center">{renderCheckbox(perm.canApprove, () => handlePermissionChange(idx, 'canApprove'), true)}</div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center">{renderCheckbox(perm.canExport, () => handlePermissionChange(idx, 'canExport'))}</div>
                      </td>
                      <td className="py-4 pr-6 text-center">
                        <div className="flex justify-center">{renderCheckbox(perm.canManage, () => handlePermissionChange(idx, 'canManage'))}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
