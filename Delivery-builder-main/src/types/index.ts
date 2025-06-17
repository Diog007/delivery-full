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

export interface BeverageCategory { // <-- ADICIONE ESTA NOVA INTERFACE
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
  category: BeverageCategory; // <-- MODIFIQUE ESTA LINHA
}

export interface AppliedExtra {
  extra: PizzaExtra;
  onFlavor: PizzaFlavor | null;
}

export type OrderableItem =
  | {
      itemType: "PIZZA";
      pizzaType: PizzaType;
      flavors: PizzaFlavor[];
      crust: PizzaCrust | null;
      appliedExtras: AppliedExtra[];
    }
  | {
      itemType: "BEVERAGE";
      beverage: Beverage;
    };

export interface CartItem {
  id: string;
  type: 'pizza' | 'beverage'; // <-- Propriedade que estava faltando
  name: string; // Um nome geral para exibição no carrinho
  pizzaType?: PizzaType;
  flavors?: PizzaFlavor[];
  crust?: PizzaCrust | null;
  appliedExtras?: AppliedExtra[]; 
  beverage?: Beverage; // Adiciona a opção de ter uma bebida
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
}