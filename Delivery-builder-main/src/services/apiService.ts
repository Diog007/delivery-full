import { Admin, DashboardStats, DailySale, SalesByPizzaType, Order, OrderStatus, PizzaExtra, PizzaFlavor, PizzaType, Customer, Address, PizzaCrust, Beverage, BeverageCategory } from "@/types";
import { AuthDtos, OrderDtos, CustomerDtos, MenuDtos } from "@/dto";

const API_BASE_URL = 'http://localhost:8090/api';

async function baseRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let url = `${API_BASE_URL}${endpoint}`;
  
  if (!options.method || options.method.toUpperCase() === 'GET') {
    url += (url.includes('?') ? '&' : '?') + `_=${new Date().getTime()}`;
  }

  const token = localStorage.getItem("customerAuthToken") || localStorage.getItem("authToken");

  const headers: HeadersInit = {};
  
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  Object.assign(headers, options.headers);

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

const publicApi = {
  getPizzaTypes: () => baseRequest<PizzaType[]>('/menu/types'),
  getPizzaFlavors: () => baseRequest<PizzaFlavor[]>('/menu/flavors'),
  getPizzaExtras: () => baseRequest<PizzaExtra[]>('/menu/extras'),
  getExtrasForType: (typeId: string) => baseRequest<PizzaExtra[]>(`/menu/types/${typeId}/extras`),
  getOrderById: (id: string) => baseRequest<Order>(`/orders/${id}`),
  getAllCrusts: () => baseRequest<PizzaCrust[]>('/menu/crusts'),
  getCrustsForType: (typeId: string) => baseRequest<PizzaCrust[]>(`/menu/types/${typeId}/crusts`),
  getBeverages: () => baseRequest<Beverage[]>('/menu/beverages'),
  getBeverageCategories: () => baseRequest<BeverageCategory[]>('/menu/beverage-categories'), // ADICIONADO
};

const customerApi = {
  login: (data: CustomerDtos.LoginRequest) => baseRequest<AuthDtos.LoginResponse>('/customer/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: CustomerDtos.RegisterRequest) => baseRequest<{ message: string }>('/customer/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  createOrder: (orderData: OrderDtos.CreateOrderDto) => baseRequest<Order>('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getCustomerOrders: () => baseRequest<Order[]>('/customer/orders'),
    forgotPassword: (email: string) => baseRequest<{ message: string }>('/customer/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) => baseRequest<{ message: string }>('/customer/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
};

const adminApi = {
  login: (data: AuthDtos.AdminLoginRequest) => baseRequest<AuthDtos.LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getDashboardStats: () => baseRequest<DashboardStats>('/admin/dashboard/stats'),
  getWeeklySales: () => baseRequest<DailySale[]>('/admin/dashboard/weekly-sales'),
  getSalesByType: () => baseRequest<SalesByPizzaType[]>('/admin/dashboard/sales-by-type'),
  getAllOrders: () => baseRequest<Order[]>('/admin/orders'),
  updateOrderStatus: (id: string, status: OrderStatus) => baseRequest<Order>(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  
  createPizzaType: (data: Partial<PizzaType>) => baseRequest<PizzaType>('/admin/types', { method: 'POST', body: JSON.stringify(data) }),
  updatePizzaType: (id: string, data: Partial<PizzaType>) => baseRequest<PizzaType>(`/admin/types/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  uploadPizzaTypeImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return baseRequest<PizzaType>(`/admin/types/${id}/image`, { method: 'POST', body: formData });
  },
  deletePizzaType: (id: string) => baseRequest<void>(`/admin/types/${id}`, { method: 'DELETE' }),
  
  createPizzaFlavor: (data: MenuDtos.FlavorUpdateRequest) => baseRequest<PizzaFlavor>('/admin/flavors', { method: 'POST', body: JSON.stringify(data) }),
  updatePizzaFlavor: (id: string, data: MenuDtos.FlavorUpdateRequest) => baseRequest<PizzaFlavor>(`/admin/flavors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  uploadFlavorImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return baseRequest<PizzaFlavor>(`/admin/flavors/${id}/image`, { method: 'POST', body: formData });
  },
  deletePizzaFlavor: (id: string) => baseRequest<void>(`/admin/flavors/${id}`, { method: 'DELETE' }),

  createPizzaExtra: (data: MenuDtos.ExtraUpdateRequest) => baseRequest<PizzaExtra>('/admin/extras', { method: 'POST', body: JSON.stringify(data) }),
  updatePizzaExtra: (id: string, data: MenuDtos.ExtraUpdateRequest) => baseRequest<PizzaExtra>(`/admin/extras/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePizzaExtra: (id: string) => baseRequest<void>(`/admin/extras/${id}`, { method: 'DELETE' }),

  createPizzaCrust: (data: MenuDtos.CrustUpdateRequest) => baseRequest<PizzaCrust>('/admin/crusts', { method: 'POST', body: JSON.stringify(data) }),
  updatePizzaCrust: (id: string, data: MenuDtos.CrustUpdateRequest) => baseRequest<PizzaCrust>(`/admin/crusts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePizzaCrust: (id: string) => baseRequest<void>(`/admin/crusts/${id}`, { method: 'DELETE' }),

  getAllCustomers: () => baseRequest<Customer[]>('/admin/customers'),
  updateCustomer: (id: string, data: CustomerDtos.AdminCustomerUpdateRequest) => baseRequest<Customer>(`/admin/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id: string) => baseRequest<void>(`/admin/customers/${id}`, { method: 'DELETE' }),
  
  updateAddress: (id: string, data: Address) => baseRequest<Address>(`/admin/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAddress: (id: string) => baseRequest<void>(`/admin/addresses/${id}`, { method: 'DELETE' }),
  
  createBeverage: (data: MenuDtos.BeverageRequestDto) => baseRequest<Beverage>('/admin/beverages', { method: 'POST', body: JSON.stringify(data) }),
  updateBeverage: (id: string, data: MenuDtos.BeverageRequestDto) => baseRequest<Beverage>(`/admin/beverages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  uploadBeverageImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return baseRequest<Beverage>(`/admin/beverages/${id}/image`, { method: 'POST', body: formData });
  },
  deleteBeverage: (id: string) => baseRequest<void>(`/admin/beverages/${id}`, { method: 'DELETE' }),

  // ADICIONADO: Métodos para gerenciar categorias de bebida
  getAllBeverageCategories: () => baseRequest<BeverageCategory[]>('/admin/beverage-categories'),
  createBeverageCategory: (data: { name: string }) => baseRequest<BeverageCategory>('/admin/beverage-categories', { method: 'POST', body: JSON.stringify(data) }),
  updateBeverageCategory: (id: string, data: { name: string }) => baseRequest<BeverageCategory>(`/admin/beverage-categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBeverageCategory: (id: string) => baseRequest<void>(`/admin/beverage-categories/${id}`, { method: 'DELETE' }),
};

export const api = {
  public: publicApi,
  customer: customerApi,
  admin: adminApi,
};