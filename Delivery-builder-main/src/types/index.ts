// REFACTOR: Tipos alinhados com os Enums e DTOs do backend refatorado.

export type OrderStatus =
  | "RECEIVED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELLED";

export type DeliveryType = "DELIVERY" | "PICKUP";
export type PaymentMethod = "CASH" | "CARD";

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
  pizzaType: PizzaType;
  price: number;
}

export interface PizzaExtra {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface CartItem {
  id: string; // ID gerado no frontend para o item do carrinho
  pizzaType: PizzaType;
  flavor: PizzaFlavor;
  extras: PizzaExtra[];
  observations: string;
  quantity: number;
  totalPrice: number;
}

// Representação segura do usuário que vem na resposta da API.
export interface CustomerUserDto {
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
  method: PaymentMethod;
  cardBrand?: string;
  cardType?: string;
}

// A interface principal para um Pedido, espelhando o OrderResponseDto do backend.
export interface Order {
  id: string;
  items: CartItem[]; // Frontend usa a interface CartItem que é compatível com OrderItemDto
  customerUser: CustomerUserDto;
  deliveryType: DeliveryType;
  deliveryAddress?: DeliveryAddress;
  payment: Payment;
  status: OrderStatus;
  createdAt: string; // Usar string para datas da API é mais seguro para serialização
  estimatedDeliveryTime?: string;
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