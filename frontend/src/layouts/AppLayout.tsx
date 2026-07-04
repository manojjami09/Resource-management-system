import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, FolderKanban, Sparkles, BarChart3,
  FileText, Bell, Settings, ChevronLeft, ChevronRight, Search,
  LogOut, User, ChevronDown, Menu,
} from "lucide-react";
import { CommandPalette } from "../components/CommandPalette";
import { useCommandPalette } from "../hooks/useCommandPalette";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/employees", label: "Employees", icon: Users },
  { path: "/projects", label: "Projects", icon: FolderKanban },
  { path: "/allocation", label: "Smart Allocation", icon: Sparkles },
  { path: "/skill-gap", label: "Skill Gap Analytics", icon: BarChart3 },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/settings", label: "Settings", icon: Settings },
];

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export function AppLayout({ children, onLogout }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(localStorage.getItem("sidebarMode") === "Collapsed");
  const [location, setLocation] = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: cmdOpen, setOpen: setCmdOpen } = useCommandPalette();
  const { user, role } = useAuth();

  useEffect(() => {
    const handleSidebarChange = () => {
      setCollapsed(localStorage.getItem("sidebarMode") === "Collapsed");
    };
    window.addEventListener("sidebar-changed", handleSidebarChange);
    return () => window.removeEventListener("sidebar-changed", handleSidebarChange);
  }, []);

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (role === "ROLE_EMPLOYEE") {
      return ["Dashboard", "Employees", "Projects", "Settings"].includes(item.label);
    }
    return true;
  }).map(item => {
    if (role === "ROLE_EMPLOYEE") {
      if (item.label === "Employees") return { ...item, label: "My Profile", icon: User };
      if (item.label === "Projects") return { ...item, label: "My Projects" };
    }
    return item;
  });

  const currentPage = filteredNavItems.find((n) => n.path === location)?.label ?? "Dashboard";

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-100 flex-shrink-0 h-screen",
          mobileOpen ? "flex" : "hidden md:flex",
        )}
      >
        {/* Logo */}
        <div 
          className={cn("flex items-center h-16 border-b border-slate-800", collapsed ? "justify-center cursor-pointer hover:bg-slate-800 transition-colors" : "px-4 justify-between")}
          onClick={() => {
            if (collapsed) {
              setCollapsed(false);
              localStorage.setItem("sidebarMode", "Expanded");
              window.dispatchEvent(new Event("sidebar-changed"));
            }
          }}
        >
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">TechCorp RMS</span>
            </motion.div>
          )}
          {collapsed && (
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(true);
                localStorage.setItem("sidebarMode", "Collapsed");
                window.dispatchEvent(new Event("sidebar-changed"));
              }}
              className="hidden md:flex h-7 w-7 rounded-md hover:bg-slate-800 items-center justify-center transition-colors flex-shrink-0"
              data-testid="sidebar-collapse-btn"
            >
              <ChevronLeft className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {filteredNavItems.map(({ path, label, icon: Icon }) => {
            const active = location === path || (path !== "/" && location.startsWith(path));
            return (
              <Link key={path} href={path}>
                <motion.div
                  whileHover={{ backgroundColor: active ? undefined : "rgba(255,255,255,0.06)" }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors text-sm font-medium",
                    active ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-100",
                    collapsed && "justify-center px-2",
                  )}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? label : undefined}
                >
                  <Icon className={cn("h-4.5 w-4.5 flex-shrink-0", active ? "text-white" : "text-slate-400")} />
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                      {label}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className={cn("border-t border-slate-800 p-3 relative", collapsed && "px-2")}>
          <div
            className={cn("flex items-center gap-3 rounded-lg p-2 cursor-pointer hover:bg-slate-800 transition-colors", collapsed && "justify-center")}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{user?.email?.substring(0, 2).toUpperCase() || "U"}</span>
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">{user?.email?.split('@')[0] || "User"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ""}</p>
                  <p className="text-[10px] text-indigo-400 mt-0.5 truncate">{role?.replace('ROLE_', '') || ""}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              </>
            )}
          </div>
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={cn(
                  "absolute bottom-[72px] rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shadow-xl z-50",
                  collapsed ? "left-4 w-48" : "left-4 right-4"
                )}
              >
                <button
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  onClick={() => { setLocation("/settings"); setUserMenuOpen(false); }}
                >
                  <User className="h-4 w-4" /> Profile & Settings
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors border-t border-slate-700"
                  onClick={onLogout}
                  data-testid="logout-btn"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-6 gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-slate-900 dark:text-white">{currentPage}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              data-testid="search-trigger"
              onClick={() => setCmdOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="text-xs">Search...</span>
              <kbd className="text-xs border border-slate-200 dark:border-slate-700 rounded px-1 bg-white dark:bg-slate-900">⌘K</kbd>
            </button>
            <button
              className="md:hidden"
              onClick={() => setCmdOpen(true)}
              data-testid="mobile-search-btn"
            >
              <Search className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}

