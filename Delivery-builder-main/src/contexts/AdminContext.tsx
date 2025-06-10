import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { Admin, DashboardStats } from "@/types";
import apiService from "@/services/apiService";

interface AdminContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  dashboardStats: DashboardStats | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshDashboard: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = admin !== null;

  const refreshDashboard = useCallback(async () => {
    if (!localStorage.getItem("authToken")) {
      return;
    }
    try {
      const stats = await apiService.getDashboardStats();
      if (stats && typeof stats.revenue === 'object' && stats.revenue !== null) {
        setDashboardStats(stats);
      } else {
        console.warn("Estrutura de dados do dashboard recebida da API está incorreta.", stats);
      }
    } catch (error) {
      console.error("Failed to refresh dashboard:", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const adminName = localStorage.getItem("adminName");
    if (token && adminName) {
      setAdmin({ id: '', username: '', name: adminName });
      refreshDashboard();
    }
    setIsLoading(false);
  }, [refreshDashboard]);

const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // --- CORREÇÃO APLICADA AQUI ---
      // A função correta é "adminLogin", não "login"
      const response = await apiService.adminLogin(username, password); 

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("adminName", response.name);
        setAdmin({ id: '', username, name: response.name });
        await refreshDashboard();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refreshDashboard]);

  const logout = useCallback(() => {
    setAdmin(null);
    setDashboardStats(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminName");
  }, []);

  const contextValue = useMemo(() => ({
    admin,
    isAuthenticated,
    dashboardStats,
    isLoading,
    login,
    logout,
    refreshDashboard,
  }), [admin, isAuthenticated, dashboardStats, isLoading, login, logout, refreshDashboard]);

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};