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
  imageUrl?: string;
  availableExtras?: PizzaExtra[];
}

export interface PizzaFlavor {
  id: string;
  name: string;
  description: string;
  pizzaType: PizzaType;
  price: number;
  imageUrl?: string;
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

export interface Order {
  id: string;
  items: CartItem[];
  customerUser: CustomerUserDto;
  deliveryType: DeliveryType;
  deliveryAddress?: DeliveryAddress;
  payment: Payment;
  status: OrderStatus;
  createdAt: string;
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
export interface DailySale {
  date: string;
  revenue: number;
}

export interface SalesByPizzaType {
  pizzaTypeName: string;
  count: number;
}

export interface Address {
    id: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    zipCode: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  cpf: string;
  addresses: Address[];
  // --- NOVOS CAMPOS ADICIONADOS ---
  status?: 'active' | 'inactive'; // Status do cliente
  totalOrders?: number;           // Total de pedidos feitos
  totalSpent?: number;            // Total gasto pelo cliente
  lastOrderDate?: string;         // Data do último pedido
}