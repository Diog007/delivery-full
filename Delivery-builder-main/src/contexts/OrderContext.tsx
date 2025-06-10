import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Order, OrderStatus } from "@/types";
import { OrderDtos } from "@/dto";
import { api } from "@/services/apiService";

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  createOrder: (orderData: OrderDtos.CreateOrderDto) => Promise<Order | undefined>;
  getOrderById: (id: string) => Promise<Order | undefined>;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  refreshOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshOrders = useCallback(async () => {
    // --- CORREÇÃO APLICADA AQUI ---
    // Só busca todos os pedidos se houver um token de admin.
    if (!localStorage.getItem("authToken")) {
        setOrders([]);
        return;
    }
    setIsLoading(true);
    try {
      const allOrders = await api.admin.getAllOrders();
      setOrders(Array.isArray(allOrders) ? allOrders : []);
    } catch (error) {
      console.error("Failed to refresh orders for admin:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Apenas executa o refresh se for um admin
    if (localStorage.getItem("authToken")) {
        refreshOrders();
    }
  }, [refreshOrders]);

  const createOrder = useCallback(async (orderData: OrderDtos.CreateOrderDto) => {
    setIsLoading(true);
    try {
      const newOrder = await api.customer.createOrder(orderData);
      // Não chama mais refreshOrders aqui para não tentar buscar como admin
      return newOrder;
    } catch (error) {
      console.error("Falha ao criar pedido:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOrderById = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const order = await api.public.getOrderById(id);
      return order;
    } catch (error) {
      console.error(`Falha ao buscar pedido ${id}:`, error);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus) => {
    try {
      await api.admin.updateOrderStatus(id, status);
      await refreshOrders();
    } catch (error) {
      console.error(`Falha ao atualizar status do pedido ${id}:`, error);
    }
  }, [refreshOrders]);

  const contextValue = useMemo(() => ({
    orders,
    isLoading,
    createOrder,
    getOrderById,
    updateOrderStatus,
    refreshOrders,
  }), [orders, isLoading, createOrder, getOrderById, updateOrderStatus, refreshOrders]);

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};