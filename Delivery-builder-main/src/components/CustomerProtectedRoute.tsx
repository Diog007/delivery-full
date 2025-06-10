// Caminho: src/components/CustomerProtectedRoute.tsx

import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

interface CustomerProtectedRouteProps {
  children: ReactNode;
}

export const CustomerProtectedRoute = ({ children }: CustomerProtectedRouteProps) => {
  const { isAuthenticated } = useCustomerAuth();

  if (!isAuthenticated) {
    // Se o cliente não estiver logado, redireciona para a página inicial
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};