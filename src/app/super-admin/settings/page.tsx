"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { 
  ArrowLeft,
  RotateCcw,
  Save,
  Pin,
  Globe,
  Shield,
  Bell,
  Cloud,
  ChevronDown,
  CloudUpload,
  Check
} from "lucide-react";

// --- Reusable Custom Components ---

const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange?: () => void }) => {
  return (
    <button 
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
        checked ? 'bg-[#0052CC]' : 'bg-slate-200'
      }`}
    >
      <span className="sr-only">Use setting</span>
      {checked && (
        <span className="absolute left-1 flex items-center justify-center w-4 h-4">
          <Check size={12} className="text-white" strokeWidth={4} />
        </span>
      )}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

const SettingsCard = ({ 
  icon: Icon, 
  title, 
  children,
  headerAction
}: { 
  icon: any; 
  title: string; 
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}) => {
  return (
    <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden mb-6">
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <Icon size={18} className="text-[#0052CC]" />
          <h3 className="text-[16px] font-bold text-[#0A2540]">{title}</h3>
        </div>
        {headerAction && (
          <div>{headerAction}</div>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </Card>
  );
};

const FormGroup = ({ 
  label, 
  description, 
  children 
}: { 
  label: string; 
  description: string; 
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-bold text-[#0A2540]">{label}</label>
      {children}
      <p className="text-[11px] font-medium text-slate-500 mt-0.5">{description}</p>
    </div>
  );
};

const CustomSelect = ({ value, options }: { value: string, options: string[] }) => {
  return (
    <div className="relative">
      <select 
        defaultValue={value}
        className="w-full h-11 px-3 text-[13px] font-bold text-[#0A2540] bg-white border border-slate-200 rounded-lg appearance-none outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] shadow-sm"
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
    </div>
  );
};

// --- Main Page Component ---

export default function SettingsPage() {
  
  // State for toggles
  const [toggles, setToggles] = useState({
    tfa: true,
    email: true,
    sms: true,
    push: false,
    reminders: true,
    refills: true,
    autoBackup: true,
  });

  const toggleSetting = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">
        
        <div className="max-w-[1000px] mx-auto space-y-2">
          
          {/* Top Actions */}
          <button className="flex items-center gap-1 text-[13px] font-bold text-[#0052CC] hover:underline mb-4">
            <ArrowLeft size={14} /> Back
          </button>

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200/60">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">⚙️</span>
                <h1 className="text-[24px] font-bold text-[#0A2540] dark:text-white tracking-tight">
                  System Settings
                </h1>
              </div>
              <p className="text-sm font-medium text-slate-500">
                Configure system-wide settings, security, and preferences
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <Button variant="outline" leftIcon={<RotateCcw size={14} />} className="font-bold text-[#0A2540] border-slate-200 hover:bg-slate-50 px-4 h-10 rounded-lg shadow-sm bg-white">
                Reset to Default
              </Button>
              <Button variant="primary" leftIcon={<Save size={14} />} className="font-bold bg-[#16A34A] hover:bg-green-700 px-5 h-10 rounded-lg shadow-sm text-white">
                Save Changes
              </Button>
            </div>
          </div>

          {/* System Information */}
          <SettingsCard icon={Pin} title="System Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormGroup label="System Name" description="The name of your healthcare platform">
                <Input defaultValue="Health Bridge AI Healthcare System" className="h-11 text-[13px] font-bold text-[#0A2540] shadow-sm" />
              </FormGroup>
              <FormGroup label="System Email" description="Primary email for system notifications">
                <Input defaultValue="admin@healthbridge.com" className="h-11 text-[13px] font-bold text-[#0A2540] shadow-sm" />
              </FormGroup>
            </div>
          </SettingsCard>

          {/* Regional Settings */}
          <SettingsCard icon={Globe} title="Regional Settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormGroup label="Time Zone" description="System-wide default time zone">
                <CustomSelect 
                  value="(UTC+5:30) Asia/Colombo" 
                  options={["(UTC+5:30) Asia/Colombo", "(UTC+0:00) London", "(UTC-5:00) Eastern Time"]} 
                />
              </FormGroup>
              <FormGroup label="Date Format" description="Preferred date display format">
                <CustomSelect 
                  value="DD/MM/YYYY" 
                  options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} 
                />
              </FormGroup>
              <FormGroup label="Time Format" description="Preferred time display format">
                <CustomSelect 
                  value="24-Hour" 
                  options={["24-Hour", "12-Hour (AM/PM)"]} 
                />
              </FormGroup>
              <FormGroup label="Language" description="Preferred language for the system interface">
                <CustomSelect 
                  value="English" 
                  options={["English", "Sinhala", "Tamil", "French"]} 
                />
              </FormGroup>
              <FormGroup label="Currency" description="Primary currency for billing and payments">
                <CustomSelect 
                  value="USD" 
                  options={["USD", "LKR", "EUR", "GBP"]} 
                />
              </FormGroup>
            </div>
          </SettingsCard>

          {/* Security Settings */}
          <SettingsCard icon={Shield} title="Security Settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between h-11">
                  <label className="text-[12px] font-bold text-[#0A2540]">Two-Factor Authentication (2FA)</label>
                  <ToggleSwitch checked={toggles.tfa} onChange={() => toggleSetting('tfa')} />
                </div>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Require 2FA for all admin and staff accounts</p>
              </div>

              <FormGroup label="Session Timeout (Minutes)" description="Auto-logout after period of inactivity">
                <Input defaultValue="30" type="number" className="h-11 text-[13px] font-bold text-[#0A2540] shadow-sm" />
              </FormGroup>

              <FormGroup label="Password Expiry (Days)" description="Force password change after specified days">
                <Input defaultValue="90" type="number" className="h-11 text-[13px] font-bold text-[#0A2540] shadow-sm" />
              </FormGroup>

              <FormGroup label="Max Login Attempts" description="Lock account after failed attempts">
                <Input defaultValue="5" type="number" className="h-11 text-[13px] font-bold text-[#0A2540] shadow-sm" />
              </FormGroup>
            </div>
          </SettingsCard>

          {/* Notification Settings */}
          <SettingsCard icon={Bell} title="Notification Settings">
            <div className="flex flex-col gap-6">
              
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                <div>
                  <h4 className="text-[13px] font-bold text-[#0A2540] mb-0.5">Email Notifications</h4>
                  <p className="text-[11px] font-medium text-slate-500">Send system alerts via email</p>
                </div>
                <ToggleSwitch checked={toggles.email} onChange={() => toggleSetting('email')} />
              </div>

              <div className="flex items-center justify-between pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                <div>
                  <h4 className="text-[13px] font-bold text-[#0A2540] mb-0.5">SMS Notifications</h4>
                  <p className="text-[11px] font-medium text-slate-500">Send urgent alerts via SMS</p>
                </div>
                <ToggleSwitch checked={toggles.sms} onChange={() => toggleSetting('sms')} />
              </div>

              <div className="flex items-center justify-between pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                <div>
                  <h4 className="text-[13px] font-bold text-[#0A2540] mb-0.5">Push Notifications</h4>
                  <p className="text-[11px] font-medium text-slate-500">Enable browser push notifications</p>
                </div>
                <ToggleSwitch checked={toggles.push} onChange={() => toggleSetting('push')} />
              </div>

              <div className="flex items-center justify-between pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                <div>
                  <h4 className="text-[13px] font-bold text-[#0A2540] mb-0.5">Appointment Reminders</h4>
                  <p className="text-[11px] font-medium text-slate-500">Auto-send patient reminders</p>
                </div>
                <ToggleSwitch checked={toggles.reminders} onChange={() => toggleSetting('reminders')} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-[#0A2540] mb-0.5">Prescription Refill Alerts</h4>
                  <p className="text-[11px] font-medium text-slate-500">Notify patients when refills are due</p>
                </div>
                <ToggleSwitch checked={toggles.refills} onChange={() => toggleSetting('refills')} />
              </div>

            </div>
          </SettingsCard>

          {/* Backup Settings */}
          <SettingsCard 
            icon={Cloud} 
            title="Backup Settings"
            headerAction={
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-[#0052CC] text-[12px] font-bold hover:bg-blue-100 transition-colors">
                <CloudUpload size={14} />
                Create Backup Now
              </button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between h-11">
                  <label className="text-[12px] font-bold text-[#0A2540]">Auto Backup</label>
                  <ToggleSwitch checked={toggles.autoBackup} onChange={() => toggleSetting('autoBackup')} />
                </div>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Automatically backup database</p>
              </div>

              <FormGroup label="Backup Frequency" description="How often to run auto backup">
                <CustomSelect 
                  value="Daily" 
                  options={["Hourly", "Daily", "Weekly", "Monthly"]} 
                />
              </FormGroup>

              <FormGroup label="Retention Period (Days)" description="How long to keep backups">
                <Input defaultValue="30" type="number" className="h-11 text-[13px] font-bold text-[#0A2540] shadow-sm" />
              </FormGroup>
            </div>
          </SettingsCard>

        </div>
      </div>
    </>
  );
}
