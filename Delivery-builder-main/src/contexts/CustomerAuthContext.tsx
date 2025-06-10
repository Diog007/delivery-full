import { createContext, useState, useContext, ReactNode, useCallback, useMemo, useEffect } from "react";
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

interface CustomerAuthContextType {
  isAuthenticated: boolean;
  customerName: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  return context;
};

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [customerName, setCustomerName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("customerAuthToken");
    const name = localStorage.getItem("customerName");
    if (token && name) {
      setCustomerName(name);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("adminName");
      
      const response = await api.customer.login(email, password);

      // --- CORREÇÃO APLICADA ---
      // Usa o type guard para validar a resposta antes de usar .token e .name
      if (isLoginResponse(response)) {
        localStorage.setItem("customerAuthToken", response.token);
        localStorage.setItem("customerName", response.name);
        setCustomerName(response.name);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Falha no login do cliente:", error);
      return false;
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      await api.customer.register(data);
      return await login(data.email, data.password);
    } catch(error) {
      console.error("Falha no registro do cliente:", error);
      alert("Falha no registro: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      return false;
    }
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("customerAuthToken");
    localStorage.removeItem("customerName");
    setCustomerName(null);
  }, []);

  const value = useMemo(() => ({
    isAuthenticated: !!customerName,
    customerName,
    login,
    register,
    logout,
  }), [customerName, login, register, logout]);

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};