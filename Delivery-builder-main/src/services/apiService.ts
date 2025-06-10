import { Admin, DashboardStats, Order, OrderStatus, PizzaExtra, PizzaFlavor, PizzaType } from "@/types";
import { AuthDtos, OrderDtos } from "@/dto";

const API_BASE_URL = 'http://localhost:8090/api';

async function baseRequest<T>(endpoint: string, options: RequestInit = {}, token: string | null): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = { ...options, headers };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || 'Ocorreu um erro na requisição.');
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error('API Service Error:', error);
    throw error;
  }
}

// --- ARQUIVO TOTALMENTE CORRIGIDO COM TIPAGEM EXPLÍCITA ---

const publicApi = {
  getPizzaTypes: () => baseRequest<PizzaType[]>('/menu/types', {}, null),
  getPizzaFlavors: () => baseRequest<PizzaFlavor[]>('/menu/flavors', {}, null),
  getPizzaExtras: () => baseRequest<PizzaExtra[]>('/menu/extras', {}, null),
  getOrderById: (id: string) => baseRequest<Order>(`/orders/${id}`, {}, null),
};

const customerApi = {
  login: (email, password) => baseRequest<AuthDtos.LoginResponse>('/customer/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, null),
  register: (data) => baseRequest<{ message: string }>('/customer/auth/register', { method: 'POST', body: JSON.stringify(data) }, null),
  
  createOrder: (orderData: OrderDtos.CreateOrderDto) => {
    const token = localStorage.getItem("customerAuthToken");
    return baseRequest<Order>('/orders', { method: 'POST', body: JSON.stringify(orderData) }, token);
  },
  
  getCustomerOrders: () => {
    const token = localStorage.getItem("customerAuthToken");
    return baseRequest<Order[]>('/customer/orders', {}, token);
  },
};

const adminApi = {
  login: (username, password) => baseRequest<AuthDtos.LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }, null),

  getDashboardStats: () => {
    const token = localStorage.getItem("authToken");
    return baseRequest<DashboardStats>('/admin/dashboard/stats', {}, token);
  },
  
  getAllOrders: () => {
    const token = localStorage.getItem("authToken");
    return baseRequest<Order[]>('/admin/orders', {}, token);
  },
  
  updateOrderStatus: (id: string, status: OrderStatus) => {
    const token = localStorage.getItem("authToken");
    return baseRequest<Order>(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token);
  },
  
  createPizzaType: (data: Partial<PizzaType>) => {
      const token = localStorage.getItem("authToken");
      return baseRequest<PizzaType>('/admin/types', { method: 'POST', body: JSON.stringify(data) }, token);
  },
  updatePizzaType: (id: string, data: Partial<PizzaType>) => {
      const token = localStorage.getItem("authToken");
      return baseRequest<PizzaType>(`/admin/types/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token);
  },
  deletePizzaType: (id: string) => {
      const token = localStorage.getItem("authToken");
      return baseRequest<void>(`/admin/types/${id}`, { method: 'DELETE' }, token);
  },
  createPizzaFlavor: (data: Partial<PizzaFlavor>) => {
      const token = localStorage.getItem("authToken");
      return baseRequest<PizzaFlavor>('/admin/flavors', { method: 'POST', body: JSON.stringify(data) }, token);
  },
  updatePizzaFlavor: (id: string, data: Partial<PizzaFlavor>) => {
      const token = localStorage.getItem("authToken");
      return baseRequest<PizzaFlavor>(`/admin/flavors/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token);
  },
  deletePizzaFlavor: (id: string) => {
      const token = localStorage.getItem("authToken");
      return baseRequest<void>(`/admin/flavors/${id}`, { method: 'DELETE' }, token);
  },
  createPizzaExtra: (data: Partial<PizzaExtra>) => {
      const token = localStorage.getItem("authToken");
      return baseRequest<PizzaExtra>('/admin/extras', { method: 'POST', body: JSON.stringify(data) }, token);
  },
  updatePizzaExtra: (id: string, data: Partial<PizzaExtra>) => {
      const token = localStorage.getItem("authToken");
      return baseRequest<PizzaExtra>(`/admin/extras/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token);
  },
  deletePizzaExtra: (id: string) => {
      const token = localStorage.getItem("authToken");
      return baseRequest<void>(`/admin/extras/${id}`, { method: 'DELETE' }, token);
  },
};

export const api = {
  public: publicApi,
  customer: customerApi,
  admin: adminApi,
};