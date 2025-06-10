import { createContext, useState, useContext, ReactNode, useCallback, useMemo, useEffect } from "react";
import apiService from "@/services/apiService";
import { AuthDtos } from "@/dto";

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
      const response = await apiService.customerLogin(email, password);
      if (response?.token) {
        localStorage.setItem("customerAuthToken", response.token);
        localStorage.setItem("customerName", response.name);
        setCustomerName(response.name);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Customer login failed:", error);
      return false;
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      await apiService.customerRegister(data);
      // Após o registro, faz o login automaticamente
      return await login(data.email, data.password);
    } catch(error) {
      console.error("Customer registration failed:", error);
      alert("Falha no registro: " + error.message);
      return false;
    }
  }, [login]);

  const logout = useCallback(() => {
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