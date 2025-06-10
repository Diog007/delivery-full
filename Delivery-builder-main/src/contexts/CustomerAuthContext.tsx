import { createContext, useState, useContext, ReactNode, useCallback, useMemo, useEffect } from "react";
import { api } from "@/services/apiService";
import { AuthDtos } from "@/dto"; // Importa o namespace dos DTOs

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

interface CustomerAuthContextType {
  isAuthenticated: boolean;
  customerName: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean; // Adicionado para feedback visual
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  return context;
};

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Estado de loading

  useEffect(() => {
    const token = localStorage.getItem("customerAuthToken");
    const name = localStorage.getItem("customerName");
    if (token && name) {
      setCustomerName(name);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.customer.login({ email, password });
      if (isLoginResponse(response)) {
        localStorage.setItem("customerAuthToken", response.token);
        localStorage.setItem("customerName", response.name);
        setCustomerName(response.name);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Falha no login do cliente:", error);
      alert(`Falha no login: ${error.message}`); // Exibe a mensagem de erro da API
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setIsLoading(true);
    try {
      await api.customer.register(data);
      // Após o registro bem-sucedido, tenta fazer o login automaticamente
      return await login(data.email, data.password);
    } catch(error) {
      console.error("Falha no registro do cliente:", error);
      // REFACTOR: Exibe a mensagem de erro específica vinda do backend (ex: "E-mail já em uso")
      alert(`Falha no registro: ${error.message}`);
      return false;
    } finally {
        setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem("customerAuthToken");
    localStorage.removeItem("customerName");
    // Limpa também o token de admin para evitar conflitos
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminName");
    setCustomerName(null);
  }, []);

  const value = useMemo(() => ({
    isAuthenticated: !!customerName,
    customerName,
    login,
    register,
    logout,
    isLoading,
  }), [customerName, login, register, logout, isLoading]);

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};