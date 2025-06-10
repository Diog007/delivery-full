// Caminho: src/types/index.ts

export interface PizzaType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
}

export interface PizzaFlavor {
  id: string;
  name: string;
  description: string;
  pizzaType: PizzaType; // Correto, espera o objeto completo
  price: number;
}

export interface PizzaExtra {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface CartItem {
  id: string;
  pizzaType: PizzaType;
  flavor: PizzaFlavor;
  extras: PizzaExtra[];
  observations: string;
  quantity: number;
  totalPrice: number;
}

// Este tipo é para os dados do formulário
export interface Customer {
  name: string;
  whatsapp: string;
  cpf: string;
  birthDate: string;
  email: string;
}

// Este tipo é para o usuário logado que vem da API
export interface CustomerUser {
  id: string;
  name: string;
  email: string;
}

export interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  zipCode: string;
}

export interface Payment {
  method: "cash" | "card";
  cardBrand?: "visa" | "mastercard" | "elo" | "amex";
  cardType?: "credit" | "debit";
}

export type OrderStatus =
  | "received"
  | "preparing"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  customerUser: CustomerUser; // Correto, espera a referência ao usuário logado
  deliveryType: "delivery" | "pickup";
  deliveryAddress?: DeliveryAddress;
  payment: Payment;
  status: OrderStatus;
  createdAt: Date;
  estimatedDeliveryTime?: Date;
  totalAmount: number;
  observations?: string;
}

export interface Admin {
  id: string;
  username: string;
  name: string;
}

export interface DashboardStats {
  todayOrders: number;
  weeklyOrders: number;
  monthlyOrders: number;
  pendingOrders: number;
  revenue: {
    today: number;
    week: number;
    month: number;
  };
}