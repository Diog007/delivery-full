export type OrderStatus =
  | "RECEIVED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELLED";

export type DeliveryType = "DELIVERY" | "PICKUP";
export type PaymentMethod = "CASH" | "CARD";
export type DrinkCategory = 'refrigerante' | 'cerveja' | 'suco' | 'agua';

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

export interface BeverageCategory {
  id: string;
  name: string;
}

export interface Beverage {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  alcoholic: boolean; 
  category: BeverageCategory;
}

export interface AppliedExtra {
  extra: PizzaExtra;
  onFlavor: PizzaFlavor | null;
}

// CORREÇÃO: A estrutura aninhada agora é definida aqui
export type OrderableItem =
  | {
      itemType: "PIZZA";
      pizzaType: PizzaType;
      flavors: PizzaFlavor[];
      crust: PizzaCrust | null;
      appliedExtras: AppliedExtra[];
      beverage?: never;
    }
  | {
      itemType: "BEVERAGE";
      beverage: Beverage;
      pizzaType?: never;
      flavors?: never;
      crust?: never;
      appliedExtras?: never;
    };

// CORREÇÃO: A interface CartItem foi atualizada para usar OrderableItem
export interface CartItem {
  id: string;
  name: string;
  item: OrderableItem;
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

export interface OrderItemFromApi {
    id: string;
    itemType: "PIZZA" | "BEVERAGE";
    pizzaType: PizzaType | null;
    flavors: PizzaFlavor[] | null;
    appliedExtras: AppliedExtra[] | null; 
    crust: PizzaCrust | null;
    beverage: Beverage | null;
    observations: string;
    quantity: number;
    totalPrice: number;
}

export interface Order {
  id: string;
  items: OrderItemFromApi[]; 
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
  googleId?: string;
  pictureUrl?: string;
  emailVerified?: boolean;
  locale?: string;
  lastLogin?: string;
  createdAt?: string;
  // --- INÍCIO DA ALTERAÇÃO ---
  totalOrders: number;
  totalSpent: number;
  // --- FIM DA ALTERAÇÃO ---
}