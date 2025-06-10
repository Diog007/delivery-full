import { Admin, DashboardStats, Order, PizzaExtra, PizzaFlavor, PizzaType } from "@/types";
import { AuthDtos, OrderDtos } from "@/dto";

const API_BASE_URL = 'http://localhost:8090/api';

/**
 * Função inteligente para pegar o token.
 * Prioriza o token do cliente, se existir, senão usa o do admin.
 */
const getToken = () => {
    return localStorage.getItem("customerAuthToken") || localStorage.getItem("authToken");
};

const apiService = {
  /**
   * Função base para fazer requisições à API.
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getToken();
    const headers: HeadersInit = { 'Content-Type': 'application/json', ...options.headers };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const config: RequestInit = { ...options, headers };
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Ocorreu um erro na requisição.');
      }
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error('API Service Error:', error);
      throw error;
    }
  },

  // === Autenticação ===
  adminLogin: (username, password) => apiService.request<AuthDtos.LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  customerLogin: (email, password) => apiService.request<AuthDtos.LoginResponse>('/customer/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  customerRegister: (data) => apiService.request<{ message: string }>('/customer/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // === Cardápio (Público) ===
  getPizzaTypes: () => apiService.request<PizzaType[]>('/menu/types'),
  getPizzaFlavors: () => apiService.request<PizzaFlavor[]>('/menu/flavors'),
  getPizzaExtras: () => apiService.request<PizzaExtra[]>('/menu/extras'),

  // === Pedidos (Cliente e Público) ===
  createOrder: (orderData) => apiService.request<Order>('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getOrderById: (id) => apiService.request<Order>(`/orders/${id}`),
  getCustomerOrders: () => apiService.request<Order[]>('/customer/orders'),
  
  // === Admin ===
  getDashboardStats: () => apiService.request<DashboardStats>('/admin/dashboard/stats'),
  /**
   * --- CORREÇÃO APLICADA AQUI ---
   * A rota para o admin buscar todos os pedidos deve ser a rota segura de admin.
   */
  getAllOrders: () => apiService.request<Order[]>('/admin/orders'),
  updateOrderStatus: (id, status) => apiService.request<Order>(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // --- Gerenciamento de Cardápio (Admin) ---
  createPizzaType: (data) => apiService.request<PizzaType>('/admin/types', { method: 'POST', body: JSON.stringify(data) }),
  updatePizzaType: (id, data) => apiService.request<PizzaType>(`/admin/types/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePizzaType: (id) => apiService.request<void>(`/admin/types/${id}`, { method: 'DELETE' }),
  createPizzaFlavor: (data) => apiService.request<PizzaFlavor>('/admin/flavors', { method: 'POST', body: JSON.stringify(data) }),
  updatePizzaFlavor: (id, data) => apiService.request<PizzaFlavor>(`/admin/flavors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePizzaFlavor: (id) => apiService.request<void>(`/admin/flavors/${id}`, { method: 'DELETE' }),
  createPizzaExtra: (data) => apiService.request<PizzaExtra>('/admin/extras', { method: 'POST', body: JSON.stringify(data) }),
  updatePizzaExtra: (id, data) => apiService.request<PizzaExtra>(`/admin/extras/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePizzaExtra: (id) => apiService.request<void>(`/admin/extras/${id}`, { method: 'DELETE' }),
};

export default apiService;