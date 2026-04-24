import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppHeader from "@/components/AppHeader";
import StudentView from "@/components/views/StudentView";
import ScanView from "@/components/views/ScanView";
import EmployeeView from "@/components/views/EmployeeView";
import AdminView from "@/components/views/AdminView";
import LoginView from "@/components/views/LoginView";
import NotFound from "./pages/NotFound.tsx";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { account } = useAuth();

  const getTabFromPath = () => {
    if (account) return "dashboard";
    const path = location.pathname;
    if (path === "/scan") return "scan";
    if (path === "/student") return "student";
    return "login";
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case "scan":
        window.location.href = "/scan";
        break;
      case "student":
        window.location.href = "/student";
        break;
      case "login":
        window.location.href = "/login";
        break;
      case "dashboard":
        window.location.href = "/dashboard";
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <AppHeader tab={getTabFromPath()} onChange={handleTabChange} />
      <main>{children}</main>
      <footer className="container py-8 text-center text-xs text-muted-foreground">
        Conectado a Supabase
      </footer>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { account, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  if (!account) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const ScanViewWrapper = () => {
  const [scannedId, setScannedId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const studentIdFromUrl = params.get("student");
    if (studentIdFromUrl) {
      setScannedId(studentIdFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
      // Redirigir a student con el ID
      setTimeout(() => {
        window.location.href = `/student?id=${studentIdFromUrl}`;
      }, 100);
    }
  }, []);

  const handleScannedId = (studentId: string) => {
    window.location.href = `/student?id=${studentId}`;
  };

  return <ScanView onStudentIdDetected={handleScannedId} />;
};

const StudentViewWrapper = () => {
  const params = new URLSearchParams(window.location.search);
  const prefilledId = params.get("id");

  return <StudentView prefilledId={prefilledId} />;
};

const DashboardView = () => {
  const { account } = useAuth();

  if (!account) {
    return <Navigate to="/login" replace />;
  }

  if (account.role === "admin") {
    return <AdminView />;
  }

  return (
    <EmployeeView
      employeeUsername={account.username}
      employeeName={account.name}
    />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <AppLayout>
                <LoginView />
              </AppLayout>
            }
          />
          <Route
            path="/scan"
            element={
              <AppLayout>
                <ScanViewWrapper />
              </AppLayout>
            }
          />
          <Route
            path="/student"
            element={
              <AppLayout>
                <StudentViewWrapper />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <ProtectedRoute>
                  <DashboardView />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route path="/" element={<Navigate to="/scan" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
