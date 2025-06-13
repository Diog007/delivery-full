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

  // Efeito 1: Apenas para restaurar a sessão a partir do localStorage.
  // Roda apenas uma vez quando o componente é montado.
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const adminName = localStorage.getItem("adminName");
    if (token && adminName) {
      setAdmin({ id: '', username: '', name: adminName });
    }
    setIsLoading(false);
  }, []); // A dependência vazia [] garante que rode apenas na montagem.

  // Efeito 2: Para buscar os dados do dashboard.
  // Roda sempre que o usuário for autenticado (no login ou no recarregamento da página).
  useEffect(() => {
    const refreshDashboardData = async () => {
      // Se não estiver autenticado, não faz nada.
      if (!isAuthenticated) return;

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
        console.error("Falha ao carregar dados do dashboard:", error);
        // Opcional: Adicionar um toast para notificar sobre o erro sem deslogar.
        // Ex: toast({ title: "Erro de Rede", description: "Não foi possível carregar os dados do dashboard."})
        // A chave aqui é NÃO chamar logout() para evitar deslogar o usuário por falhas de rede.
      }
    };

    refreshDashboardData();
  }, [isAuthenticated]); // A dependência [isAuthenticated] dispara o efeito quando o login muda.

  const login = useCallback(async (username, password): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.admin.login({ username, password });

      if (isLoginResponse(response)) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("adminName", response.name);
        setAdmin({ id: '', username, name: response.name });
        // Os dados do dashboard serão carregados automaticamente pelo useEffect acima.
        return true;
      }
      return false;
    } catch (error) {
      console.error("Falha no login de admin:", error);
      alert(`Falha no login: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função para o botão "Atualizar" no dashboard
  const refreshDashboardManual = useCallback(async () => {
     if (!isAuthenticated) return;
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
         console.error("Falha ao atualizar dashboard manualmente:", error);
      }
  }, [isAuthenticated]);

  const contextValue = useMemo(() => ({
    admin,
    isAuthenticated,
    dashboardStats,
    weeklySales,
    salesByType,
    isLoading,
    login,
    logout,
    refreshDashboard: refreshDashboardManual,
  }), [admin, isAuthenticated, dashboardStats, weeklySales, salesByType, isLoading, login, logout, refreshDashboardManual]);

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};