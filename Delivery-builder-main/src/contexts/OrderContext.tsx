import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { Order, OrderStatus } from "@/types";
import { OrderDtos } from "@/dto";
import apiService from "@/services/apiService";

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

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- CORREÇÃO: Usando useCallback para estabilizar a função ---
  const refreshOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const allOrders = await apiService.getAllOrders();
      setOrders(Array.isArray(allOrders) ? allOrders : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]); // Garante que orders seja sempre um array
    } finally {
      setIsLoading(false);
    }
  }, []); // Array de dependências vazio, pois a função não depende de props/state

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  // --- CORREÇÃO: Usando useCallback ---
  const createOrder = useCallback(async (orderData: OrderDtos.CreateOrderDto) => {
    setIsLoading(true);
    try {
      const newOrder = await apiService.createOrder(orderData);
      await refreshOrders(); // Atualiza a lista de pedidos
      return newOrder;
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refreshOrders]); // Depende de refreshOrders

  // --- CORREÇÃO: Usando useCallback ---
  const getOrderById = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const order = await apiService.getOrderById(id);
      return order;
    } catch (error) {
      console.error(`Failed to fetch order ${id}:`, error);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- CORREÇÃO: Usando useCallback ---
  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus) => {
    try {
      await apiService.updateOrderStatus(id, status);
      await refreshOrders();
    } catch (error) {
      console.error(`Failed to update order status for ${id}:`, error);
    }
  }, [refreshOrders]); // Depende de refreshOrders

  // --- Otimização: Usando useMemo para o valor do contexto ---
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