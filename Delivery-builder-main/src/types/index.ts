export type OrderStatus =
  | "RECEIVED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELLED";

export type DeliveryType = "DELIVERY" | "PICKUP";
export type PaymentMethod = "CASH" | "CARD";

export interface PizzaCrust {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface PizzaType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl?: string;
  availableExtras?: PizzaExtra[];
  availableCrusts?: PizzaCrust[];
}

export interface PizzaFlavor {
  id: string;
  name: string;
  description: string;
  pizzaTypes: PizzaType[];
  price: number;
  imageUrl?: string;
}

export interface PizzaExtra {
  id: string;
  name: string;
  description: string;
  price: number;
}

// Nova interface para representar um adicional e sua posição
export interface AppliedExtra {
  extra: PizzaExtra;
  onFlavor: PizzaFlavor | null; // null significa pizza toda
}

export interface CartItem {
  id: string;
  pizzaType: PizzaType;
  flavors: PizzaFlavor[];
  crust: PizzaCrust | null;
  appliedExtras: AppliedExtra[]; // MODIFICADO de `extras`
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

// Interface para um item de pedido como vem da API
interface OrderItemFromApi {
    id: string;
    pizzaType: PizzaType;
    flavors: PizzaFlavor[];
    appliedExtras: AppliedExtra[]; // MODIFICADO
    crust: PizzaCrust | null;
    observations: string;
    quantity: number;
    totalPrice: number;
}

export interface Order {
  id: string;
  items: OrderItemFromApi[]; // MODIFICADO
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
}