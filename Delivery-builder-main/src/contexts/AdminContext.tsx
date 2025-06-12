import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { Admin, DashboardStats, DailySale, SalesByPizzaType } from "@/types";
import { api } from "@/services/apiService";
import { AuthDtos } from "@/dto";

function isLoginResponse(data: any): data is AuthDtos.LoginResponse {
    return data && typeof data.token === 'string' && typeof data.name === 'string';
}

interface AdminContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  dashboardStats: DashboardStats | null;
  weeklySales: DailySale[];
  salesByType: SalesByPizzaType[];
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
  const [weeklySales, setWeeklySales] = useState<DailySale[]>([]);
  const [salesByType, setSalesByType] = useState<SalesByPizzaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = admin !== null;

  const logout = useCallback(() => {
    setAdmin(null);
    setDashboardStats(null);
    setWeeklySales([]);
    setSalesByType([]);
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminName");
  }, []);

  const refreshDashboard = useCallback(async () => {
    if (!localStorage.getItem("authToken")) return;
    try {
      const [stats, sales, types] = await Promise.all([
        api.admin.getDashboardStats(),
        api.admin.getWeeklySales(),
        api.admin.getSalesByType()
      ]);
      
      setDashboardStats(stats);
      setWeeklySales(sales);
      setSalesByType(types);

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

  // --- FUNÇÃO LOGIN CORRIGIDA E COMPLETA ---
  const login = useCallback(async (username, password): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.admin.login({ username, password });

      if (isLoginResponse(response)) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("adminName", response.name);
        setAdmin({ id: '', username, name: response.name });
        await refreshDashboard();
        return true; // Retorna true em caso de sucesso
      }
      return false; // Retorna false se a resposta não for a esperada
    } catch (error) {
      console.error("Falha no login de admin:", error);
      alert(`Falha no login: ${error.message}`);
      return false; // Retorna false em caso de erro
    } finally {
      setIsLoading(false);
    }
  }, [refreshDashboard]);

  const contextValue = useMemo(() => ({
    admin,
    isAuthenticated,
    dashboardStats,
    weeklySales,
    salesByType,
    isLoading,
    login,
    logout,
    refreshDashboard,
  }), [admin, isAuthenticated, dashboardStats, weeklySales, salesByType, isLoading, login, logout, refreshDashboard]);

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};