import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Bell, Palette, Database, Mail, Save, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/AuthContext";
import { getSettings, saveSettings, UserSettings } from "../services/settingsService";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "security", label: "Security", icon: Shield },
  { key: "integrations", label: "Integrations", icon: Database },
];

function NotificationItem({ label, desc, checked, onChange }: { label: string, desc: string, checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn("relative h-6 w-11 rounded-full transition-colors flex-shrink-0", checked ? "bg-indigo-600" : "bg-slate-200")}
      >
        <span className={cn("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white dark:bg-slate-900 shadow transition-transform", checked ? "translate-x-5" : "translate-x-0")} />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "Light");
  const [sidebarMode, setSidebarMode] = useState(localStorage.getItem("sidebarMode") || "Expanded");
  const [loadingSettings, setLoadingSettings] = useState(true);
  
  const [notificationSettings, setNotificationSettings] = useState<UserSettings>({
    rolloffAlerts: true,
    benchThresholdAlerts: true,
    skillGapWarnings: true,
    allocationRequests: true,
    projectDelayAlerts: false,
    weeklySummaryEmail: true
  });

  useEffect(() => {
    getSettings().then(data => {
      setNotificationSettings(data);
      setLoadingSettings(false);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new Event("theme-changed"));
  }, [theme]);

  const handleSidebarChange = (mode: string) => {
    setSidebarMode(mode);
    localStorage.setItem("sidebarMode", mode);
    window.dispatchEvent(new Event("sidebar-changed"));
  };

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account, preferences, and system configuration</p>
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
                  activeTab === key ? "bg-indigo-50 text-indigo-700" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800"
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
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Profile Information</h2>

                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.email}</p>
                    <p className="text-xs text-slate-400 capitalize mt-0.5">{role?.replace("ROLE_", "")}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Email Address</label>
                  <input
                    value={user?.email || ""}
                    type="email"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 cursor-not-allowed"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Role</label>
                  <input
                    value={role?.replace("ROLE_", "") || ""}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 cursor-not-allowed capitalize"
                    readOnly
                  />
                </div>

                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-3 mt-4">
                  <Info className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-indigo-900">Profile editing coming soon</p>
                    <p className="text-xs text-indigo-700 mt-1">Updating names, bios, and profile pictures will be supported in a future backend update.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "appearance" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Appearance</h2>
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {["Light", "Dark", "System"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn("rounded-lg border-2 p-4 text-sm font-medium transition-all", theme === t ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300")}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-3">Sidebar Mode</p>
                  <div className="grid grid-cols-2 gap-3">
                    {["Expanded", "Collapsed"].map((t) => (
                      <button
                        key={t}
                        onClick={() => handleSidebarChange(t)}
                        className={cn("rounded-lg border-2 p-4 text-sm font-medium transition-all", sidebarMode === t ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300")}
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
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Security Settings</h2>
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-3">
                  <Info className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-indigo-900">Security settings coming soon</p>
                    <p className="text-xs text-indigo-700 mt-1">Password changes and 2FA will be supported once the authentication backend is fully implemented.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "integrations" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Integrations</h2>
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-3">
                  <Info className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-indigo-900">Integrations coming soon</p>
                    <p className="text-xs text-indigo-700 mt-1">JIRA, Slack, and other enterprise integrations are planned for a future release.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Save button */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
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

