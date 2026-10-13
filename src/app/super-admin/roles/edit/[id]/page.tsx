"use client";

import React, { useState, useEffect, use } from "react";
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

// Helper to generate mock permissions
const generateMockPermissions = (roleId: string) => {
  return MODULES.map(moduleName => ({
    moduleName,
    canView: true,
    canCreate: Math.random() > 0.5,
    canEdit: Math.random() > 0.5,
    canDelete: Math.random() > 0.8,
    canApprove: Math.random() > 0.7,
    canExport: Math.random() > 0.6,
    canManage: Math.random() > 0.8
  }));
};

const FormGroup = ({ label, required, children }: { label: string, required?: boolean, children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-bold text-[#0A2540]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export default function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [roleData, setRoleData] = useState({
    id: unwrappedParams.id,
    roleId: "",
    name: "",
    type: "Custom Role",
    status: "Active",
    riskLevel: "",
    riskRecommendations: ""
  });

  const [permissions, setPermissions] = useState<any[]>([]);

  useEffect(() => {
    fetchRoleData();
  }, [unwrappedParams.id]);

  const fetchRoleData = async () => {
    try {
      setLoading(true);
      const role = await superAdminService.getRoleById(unwrappedParams.id);
      
      setRoleData({
        id: role.id,
        roleId: role.roleId,
        name: role.name,
        type: role.type?.toUpperCase().includes("SYS") ? "System Role" : "Custom Role",
        status: role.status?.toUpperCase() === "INACTIVE" ? "Inactive" : "Active",
        riskLevel: role.riskLevel || "LOW",
        riskRecommendations: role.riskRecommendations || ""
      });
      
      const permsData = [];
      if (role.permissionIds && role.permissionIds.length > 0) {
        for (const permId of role.permissionIds) {
          try {
            const perm = await superAdminService.getPermissionById(permId);
            permsData.push(perm);
          } catch (e) {
            console.error(`Failed to load permission ${permId}`);
          }
        }
        setPermissions(permsData);
      } else {
        setPermissions(generateMockPermissions(unwrappedParams.id));
      }
    } catch (error) {
      toast.error("Failed to load role details");
      router.push("/super-admin/roles");
    } finally {
      setLoading(false);
    }
  };

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
      // Update Role with embedded permissions
      const rolePayload = {
        roleId: roleData.roleId,
        name: roleData.name,
        type: roleData.type === "System Role" ? "SYSTEM" : "CUSTOM",
        status: roleData.status ? roleData.status.toUpperCase() : "ACTIVE",
        permissions: permissions.map(p => ({
          id: p.id,
          moduleName: p.moduleName,
          canView: p.canView,
          canCreate: p.canCreate,
          canEdit: p.canEdit,
          canDelete: p.canDelete,
          canApprove: p.canApprove,
          canExport: p.canExport,
          canManage: p.canManage
        })),
        riskLevel: roleData.riskLevel,
        riskRecommendations: roleData.riskRecommendations
      };

      await superAdminService.updateRole(unwrappedParams.id, rolePayload);
      
      toast.success("Role updated successfully!");
      router.push("/super-admin/roles");
    } catch (error) {
      toast.error("Failed to update role");
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-medium">Loading role configuration...</div>;
  }

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
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-bold text-[#0A2540] dark:text-white tracking-tight">Edit Role</h1>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                {roleData.roleId}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Modify details and access permissions for {roleData.name}</p>
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
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Basic Details & AI Analysis */}
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

              <FormGroup label="Status">
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

          {roleData.riskLevel === "HIGH" ? (
            <Card className="p-6 rounded-2xl border border-red-200 bg-red-50 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <ShieldAlert size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-700 mb-1">AI Access Risk Analysis: HIGH</h3>
                  <p className="text-[13px] font-medium text-red-600 leading-relaxed">
                    {roleData.riskRecommendations}
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 rounded-2xl border border-blue-100 bg-blue-50/50 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldAlert size={16} className="text-[#0052CC]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0A2540] mb-1">AI Permission Insights</h3>
                  <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                    No critical security risks or SoD violations detected for this role's current configuration.
                  </p>
                </div>
              </div>
            </Card>
          )}
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
