import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context Providers
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { CustomerAuthProvider } from "./contexts/CustomerAuthContext";

// Components
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CustomerProtectedRoute } from "./components/CustomerProtectedRoute";

// Client Pages
import { HomePage } from "@/pages/client/HomePage";
import { PizzaCustomization } from "@/pages/client/PizzaCustomization";
import { Cart } from "@/pages/client/Cart";
import { Checkout } from "@/pages/client/Checkout";
import { OrderTracking } from "@/pages/client/OrderTracking";
import { MyOrders } from "./pages/client/MyOrders";

// Admin Pages
import { AdminLogin } from "@/pages/admin/Login";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { MenuManagement } from "@/pages/admin/MenuManagement";
import { OrderManagement } from "@/pages/admin/OrderManagement";

// General Pages
import NotFound from "./pages/NotFound";
import { CustomerManagement } from "./pages/admin/CustomerManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <CustomerAuthProvider>
          <CartProvider>
            <OrderProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* --- Rotas de Cliente --- */}
                  <Route path="/" element={<HomePage />} />
                  {/* A rota /beverages foi removida */}
                  <Route path="/customize" element={<PizzaCustomization />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/tracking" element={<OrderTracking />} />
                  <Route path="/tracking/:orderId" element={<OrderTracking />} />
                  
                  <Route
                    path="/my-orders"
                    element={
                      <CustomerProtectedRoute>
                        <MyOrders />
                      </CustomerProtectedRoute>
                    }
                  />

                  {/* --- Rotas de Admin --- */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={<Navigate to="/admin/dashboard" replace />}
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/menu"
                    element={
                      <ProtectedRoute>
                        <MenuManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedRoute>
                        <OrderManagement />
                      </ProtectedRoute>
                    }
                  />
                   <Route
                    path="/admin/customers"
                    element={
                      <ProtectedRoute>
                        <CustomerManagement />
                      </ProtectedRoute>
                    }
                  />

                  {/* Rota para página não encontrada */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </OrderProvider>
          </CartProvider>
        </CustomerAuthProvider>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;