import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
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
import { AuthProvider, useAuth } from "./context/AuthContext";

function AuthGuard({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-indigo-600"><span className="animate-pulse">Loading...</span></div>;
  }
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  return <AppLayout onLogout={onLogout}>{children}</AppLayout>;
}



function AppContent() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Switch>
          <Route path="/login" component={() => (user ? <Redirect to="/dashboard" /> : <LoginPage />)} />
          <Route path="/" component={() => <Redirect to="/dashboard" />} />
          <Route path="/dashboard" component={() => <AuthGuard onLogout={logout}><DashboardPage /></AuthGuard>} />
          <Route path="/employees" component={() => <AuthGuard onLogout={logout}><EmployeesPage /></AuthGuard>} />
          <Route path="/projects" component={() => <AuthGuard onLogout={logout}><ProjectsPage /></AuthGuard>} />
          <Route path="/allocation" component={() => <AuthGuard onLogout={logout}><AllocationPage /></AuthGuard>} />
          <Route path="/skill-gap" component={() => <AuthGuard onLogout={logout}><SkillGapPage /></AuthGuard>} />
          <Route path="/reports" component={() => <AuthGuard onLogout={logout}><ReportsPage /></AuthGuard>} />
          <Route path="/notifications" component={() => <AuthGuard onLogout={logout}><NotificationsPage /></AuthGuard>} />
          <Route path="/settings" component={() => <AuthGuard onLogout={logout}><SettingsPage /></AuthGuard>} />
          <Route component={NotFound} />
        </Switch>
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
