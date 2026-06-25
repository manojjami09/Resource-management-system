import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "./layouts/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { AllocationPage } from "./pages/AllocationPage";
import { SkillGapPage } from "./pages/SkillGapPage";
import { ReportsPage } from "./pages/ReportsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SettingsPage } from "./pages/SettingsPage";
import NotFound from "./pages/not-found";

function AuthGuard({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  return <AppLayout onLogout={onLogout}>{children}</AppLayout>;
}

function AppRouter({ onLogout }: { onLogout: () => void }) {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/dashboard" />} />
      <Route path="/dashboard" component={() => <AuthGuard onLogout={onLogout}><DashboardPage /></AuthGuard>} />
      <Route path="/employees" component={() => <AuthGuard onLogout={onLogout}><EmployeesPage /></AuthGuard>} />
      <Route path="/projects" component={() => <AuthGuard onLogout={onLogout}><ProjectsPage /></AuthGuard>} />
      <Route path="/allocation" component={() => <AuthGuard onLogout={onLogout}><AllocationPage /></AuthGuard>} />
      <Route path="/skill-gap" component={() => <AuthGuard onLogout={onLogout}><SkillGapPage /></AuthGuard>} />
      <Route path="/reports" component={() => <AuthGuard onLogout={onLogout}><ReportsPage /></AuthGuard>} />
      <Route path="/notifications" component={() => <AuthGuard onLogout={onLogout}><NotificationsPage /></AuthGuard>} />
      <Route path="/settings" component={() => <AuthGuard onLogout={onLogout}><SettingsPage /></AuthGuard>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("rms_auth") === "true");

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem("rms_auth");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <TooltipProvider>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AppRouter onLogout={handleLogout} />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
