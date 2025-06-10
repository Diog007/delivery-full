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
import { api } from "@/services/apiService";
import { AuthDtos } from "@/dto"; // Importa o namespace dos DTOs

// --- Type Guard para a resposta do Login ---
function isLoginResponse(data: any): data is AuthDtos.LoginResponse {
  return (
    data &&
    typeof data === 'object' &&
    'token' in data &&
    typeof data.token === 'string' &&
    'name' in data &&
    typeof data.name === 'string'
  );
}

// --- Type Guard para as estatísticas do Dashboard ---
function isDashboardStats(data: any): data is DashboardStats {
  return (
    data &&
    typeof data === 'object' &&
    'revenue' in data &&
    typeof data.revenue === 'object' &&
    data.revenue !== null
  );
}

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

  const logout = useCallback(() => {
    setAdmin(null);
    setDashboardStats(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("customerAuthToken");
    localStorage.removeItem("customerName");
  }, []);

  const refreshDashboard = useCallback(async () => {
    if (!localStorage.getItem("authToken")) return;
    try {
      const stats = await api.admin.getDashboardStats();
      if (isDashboardStats(stats)) {
        setDashboardStats(stats);
      } else {
        setDashboardStats(null);
      }
    } catch (error) {
      console.error("Falha ao atualizar dashboard:", error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const adminName = localStorage.getItem("adminName");
    if (token && adminName) {
      setAdmin({ id: '', username: '', name: adminName });
      refreshDashboard();
    }
    setIsLoading(false);
  }, [refreshDashboard]);

  const login = useCallback(async (username, password): Promise<boolean> => {
    setIsLoading(true);
    try {
      localStorage.removeItem("customerAuthToken");
      localStorage.removeItem("customerName");
      
      const response = await api.admin.login(username, password);

      // --- CORREÇÃO APLICADA ---
      // Usa o type guard para validar a resposta antes de usar .token e .name
      if (isLoginResponse(response)) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("adminName", response.name);
        setAdmin({ id: '', username, name: response.name });
        await refreshDashboard();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Falha no login de admin:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refreshDashboard]);

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