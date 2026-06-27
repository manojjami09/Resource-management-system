import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Bell, Palette, Database, Mail, Save, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "security", label: "Security", icon: Shield },
  { key: "integrations", label: "Integrations", icon: Database },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account, preferences, and system configuration</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                data-testid={`settings-tab-${key}`}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                  activeTab === key ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h2 className="text-base font-semibold text-slate-800">Profile Information</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    AD
                  </div>
                  <div>
                    <button className="text-sm font-medium text-indigo-600 hover:underline">Upload new photo</button>
                    <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, GIF up to 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "First Name", value: "Admin", placeholder: "First name" },
                    { label: "Last Name", value: "User", placeholder: "Last name" },
                  ].map(({ label, value, placeholder }) => (
                    <div key={label}>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
                      <input
                        defaultValue={value}
                        placeholder={placeholder}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address</label>
                  <input
                    defaultValue="admin@techcorp.com"
                    type="email"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Role</label>
                  <input
                    defaultValue="Resource Manager"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 bg-slate-50 cursor-not-allowed"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Bio</label>
                  <textarea
                    defaultValue="Resource Manager at TechCorp, overseeing 120+ consultants across 35 active projects."
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all resize-none"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h2 className="text-base font-semibold text-slate-800">Notification Preferences</h2>
                {[
                  { label: "Roll-off Alerts", desc: "Get notified when resources are about to roll off", default: true },
                  { label: "Bench Threshold Alerts", desc: "Alert when bench % exceeds configured threshold", default: true },
                  { label: "Skill Gap Warnings", desc: "Notifications when critical skill gaps are detected", default: true },
                  { label: "Allocation Requests", desc: "New resource requests from project managers", default: true },
                  { label: "Project Delay Alerts", desc: "When projects are flagged as at-risk or delayed", default: false },
                  { label: "Weekly Summary Email", desc: "Weekly utilization and bench digest every Monday", default: true },
                ].map(({ label, desc, default: def }) => {
                  const [checked, setChecked] = useState(def);
                  return (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{label}</p>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                      <button
                        onClick={() => setChecked(!checked)}
                        className={cn("relative h-6 w-11 rounded-full transition-colors flex-shrink-0", checked ? "bg-indigo-600" : "bg-slate-200")}
                      >
                        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-5" : "translate-x-0.5")} />
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === "appearance" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h2 className="text-base font-semibold text-slate-800">Appearance</h2>
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {["Light", "Dark", "System"].map((t) => (
                      <button
                        key={t}
                        className={cn("rounded-lg border-2 p-4 text-sm font-medium transition-all", t === "Light" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:border-slate-300")}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-3">Sidebar Mode</p>
                  <div className="grid grid-cols-2 gap-3">
                    {["Expanded", "Collapsed"].map((t) => (
                      <button
                        key={t}
                        className={cn("rounded-lg border-2 p-4 text-sm font-medium transition-all", t === "Expanded" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:border-slate-300")}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h2 className="text-base font-semibold text-slate-800">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Confirm Password</label>
                    <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all" />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-800 mb-2">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500 mb-3">Add an extra layer of security to your account. Not yet configured.</p>
                  <button className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "integrations" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="text-base font-semibold text-slate-800">Integrations</h2>
                <p className="text-sm text-slate-500">Connect to your existing tools and systems. These will auto-populate when you connect to a Java Spring Boot backend.</p>
                {[
                  { name: "JIRA", desc: "Sync project tasks and milestones", connected: false },
                  { name: "Outlook / Teams", desc: "Receive notifications via email and Teams", connected: true },
                  { name: "Spring Boot REST API", desc: "Connect to your enterprise backend", connected: false },
                  { name: "HRMS", desc: "Sync employee data from HR system", connected: false },
                  { name: "SAP", desc: "Financial reporting and billing integration", connected: false },
                ].map(({ name, desc, connected }) => (
                  <div key={name} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{name}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                    <span className={cn("text-xs font-semibold px-3 py-1 rounded-full border",
                      connected ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                    )}>
                      {connected ? "Connected" : "Configure"}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Save button */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                data-testid="btn-save-settings"
                className={cn("flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
                  saved ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                )}
              >
                {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Changes</>}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
