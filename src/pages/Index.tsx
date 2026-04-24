import { useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";

const Index = () => {
  const { account } = useAuth();
  const location = useLocation();

  // Obtener el tab actual basado en la ruta
  const getTabFromPath = () => {
    if (account) return "dashboard";
    const path = location.pathname;
    if (path === "/scan") return "scan";
    if (path === "/student") return "student";
    return "login";
  };

  useEffect(() => {
    document.title = "Atención Estudiantil · Sistema";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <AppHeader tab={getTabFromPath()} onChange={() => {}} />
      <main>{/* Las vistas se renderizan en App.tsx con las rutas */}</main>
      <footer className="container py-8 text-center text-xs text-muted-foreground">
        Conectado a Supabase
      </footer>
    </div>
  );
};

export default Index;
