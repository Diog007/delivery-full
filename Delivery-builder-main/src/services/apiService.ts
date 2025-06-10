import { Admin, DashboardStats, Order, OrderStatus, PizzaExtra, PizzaFlavor, PizzaType } from "@/types";
import { AuthDtos, OrderDtos } from "@/dto";

const API_BASE_URL = 'http://localhost:8090/api';

async function baseRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let url = `${API_BASE_URL}${endpoint}`;
  
  // --- CORREÇÃO APLICADA AQUI (Cache Busting) ---
  // Se for uma requisição GET, adicionamos um parâmetro de timestamp à URL.
  // Isso torna cada requisição única para o navegador, forçando-o a buscar
  // os dados mais recentes do servidor em vez de usar o cache.
  if (!options.method || options.method.toUpperCase() === 'GET') {
    url += `?_=${new Date().getTime()}`;
  }

  const token = localStorage.getItem("customerAuthToken") || localStorage.getItem("authToken");

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

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
    console.error('Erro no serviço da API:', error);
    throw error;
  }
}

// --- API Pública ---
const publicApi = {
  getPizzaTypes: () => baseRequest<PizzaType[]>('/menu/types'),
  getPizzaFlavors: () => baseRequest<PizzaFlavor[]>('/menu/flavors'),
  getPizzaExtras: () => baseRequest<PizzaExtra[]>('/menu/extras'),
  getOrderById: (id: string) => baseRequest<Order>(`/orders/${id}`),
};

// --- API do Cliente ---
const customerApi = {
  login: (data) => baseRequest<AuthDtos.LoginResponse>('/customer/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => baseRequest<{ message: string }>('/customer/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  createOrder: (orderData: OrderDtos.CreateOrderDto) => baseRequest<Order>('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getCustomerOrders: () => baseRequest<Order[]>('/customer/orders'),
};

// --- API do Admin ---
const adminApi = {
  // --- CORREÇÃO APLICADA AQUI ---
  // A função de login agora espera um único objeto `data` contendo username e password.
  login: (data: AuthDtos.AdminLoginRequest) => baseRequest<AuthDtos.LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  
  getDashboardStats: () => baseRequest<DashboardStats>('/admin/dashboard/stats'),
  getAllOrders: () => baseRequest<Order[]>('/admin/orders'),
  updateOrderStatus: (id: string, status: OrderStatus) => baseRequest<Order>(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  
  // ... (o restante das funções de gerenciamento de menu permanece igual)
  createPizzaType: (data: Partial<PizzaType>) => baseRequest<PizzaType>('/admin/types', { method: 'POST', body: JSON.stringify(data) }),
  updatePizzaType: (id: string, data: Partial<PizzaType>) => baseRequest<PizzaType>(`/admin/types/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePizzaType: (id: string) => baseRequest<void>(`/admin/types/${id}`, { method: 'DELETE' }),
  createPizzaFlavor: (data: Partial<PizzaFlavor>) => baseRequest<PizzaFlavor>('/admin/flavors', { method: 'POST', body: JSON.stringify(data) }),
  updatePizzaFlavor: (id: string, data: Partial<PizzaFlavor>) => baseRequest<PizzaFlavor>(`/admin/flavors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePizzaFlavor: (id: string) => baseRequest<void>(`/admin/flavors/${id}`, { method: 'DELETE' }),
  createPizzaExtra: (data: Partial<PizzaExtra>) => baseRequest<PizzaExtra>('/admin/extras', { method: 'POST', body: JSON.stringify(data) }),
  updatePizzaExtra: (id: string, data: Partial<PizzaExtra>) => baseRequest<PizzaExtra>(`/admin/extras/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePizzaExtra: (id: string) => baseRequest<void>(`/admin/extras/${id}`, { method: 'DELETE' }),
};

export const api = {
  public: publicApi,
  customer: customerApi,
  admin: adminApi,
};