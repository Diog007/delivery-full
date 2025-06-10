import {
  PizzaType,
  PizzaFlavor,
  PizzaExtra,
  Order,
  OrderStatus,
  DashboardStats,
} from "@/types";

// Mock data for pizza types
export const pizzaTypes: PizzaType[] = [
  {
    id: "1",
    name: "Pizza Grande",
    description: "Pizza tradicional de 35cm, serve até 4 pessoas",
    basePrice: 25.0,
  },
  {
    id: "2",
    name: "Pizza Pequena",
    description: "Pizza individual de 25cm, serve até 2 pessoas",
    basePrice: 18.0,
  },
  {
    id: "3",
    name: "Pizza Doce",
    description: "Pizza doce especial com massa açucarada",
    basePrice: 22.0,
  },
];

// Mock data for pizza flavors
export const pizzaFlavors: PizzaFlavor[] = [
  // Flavors for Pizza Grande
  {
    id: "1",
    name: "Margherita",
    description: "Molho de tomate, mussarela e manjericão",
    typeId: "1",
    price: 0,
  },
  {
    id: "2",
    name: "Calabresa",
    description: "Molho de tomate, mussarela e calabresa",
    typeId: "1",
    price: 3,
  },
  {
    id: "3",
    name: "Portuguesa",
    description: "Molho de tomate, mussarela, presunto, ovos e azeitonas",
    typeId: "1",
    price: 5,
  },
  {
    id: "4",
    name: "Quatro Queijos",
    description: "Mussarela, parmesão, gorgonzola e provolone",
    typeId: "1",
    price: 7,
  },
  {
    id: "5",
    name: "Frango com Catupiry",
    description: "Molho de tomate, mussarela, frango desfiado e catupiry",
    typeId: "1",
    price: 6,
  },

  // Flavors for Pizza Pequena
  {
    id: "6",
    name: "Margherita",
    description: "Molho de tomate, mussarela e manjericão",
    typeId: "2",
    price: 0,
  },
  {
    id: "7",
    name: "Calabresa",
    description: "Molho de tomate, mussarela e calabresa",
    typeId: "2",
    price: 2,
  },
  {
    id: "8",
    name: "Portuguesa",
    description: "Molho de tomate, mussarela, presunto, ovos e azeitonas",
    typeId: "2",
    price: 4,
  },
  {
    id: "9",
    name: "Quatro Queijos",
    description: "Mussarela, parmesão, gorgonzola e provolone",
    typeId: "2",
    price: 5,
  },

  // Flavors for Pizza Doce
  {
    id: "10",
    name: "Brigadeiro",
    description: "Chocolate, granulado e leite condensado",
    typeId: "3",
    price: 0,
  },
  {
    id: "11",
    name: "Romeu e Julieta",
    description: "Queijo e goiabada",
    typeId: "3",
    price: 2,
  },
  {
    id: "12",
    name: "Banana com Canela",
    description: "Banana, canela e açúcar cristal",
    typeId: "3",
    price: 1,
  },
];

// Mock data for pizza extras
export const pizzaExtras: PizzaExtra[] = [
  {
    id: "1",
    name: "Borda Recheada com Catupiry",
    description: "Borda recheada com catupiry cremoso",
    price: 8,
  },
  {
    id: "2",
    name: "Borda Recheada com Cheddar",
    description: "Borda recheada com queijo cheddar",
    price: 8,
  },
  {
    id: "3",
    name: "Extra Queijo",
    description: "Dobro de queijo mussarela",
    price: 5,
  },
  {
    id: "4",
    name: "Extra Calabresa",
    description: "Porção extra de calabresa",
    price: 6,
  },
  {
    id: "5",
    name: "Azeitonas",
    description: "Azeitonas pretas fatiadas",
    price: 3,
  },
  {
    id: "6",
    name: "Orégano Extra",
    description: "Orégano em abundância",
    price: 1,
  },
];

// Mock orders data
export let mockOrders: Order[] = [
  {
    id: "1",
    items: [
      {
        id: "1",
        pizzaType: pizzaTypes[0],
        flavor: pizzaFlavors[2],
        extras: [pizzaExtras[0]],
        observations: "Sem cebola",
        quantity: 1,
        totalPrice: 38.0,
      },
    ],
    customer: {
      name: "João Silva",
      whatsapp: "(11) 99999-9999",
      cpf: "123.456.789-00",
      birthDate: "1990-01-01",
      email: "joao@email.com",
    },
    deliveryType: "delivery",
    deliveryAddress: {
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Centro",
      city: "São Paulo",
      zipCode: "01234-567",
    },
    payment: {
      method: "card",
      cardBrand: "visa",
      cardType: "credit",
    },
    status: "preparing",
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    totalAmount: 38.0,
  },
  {
    id: "2",
    items: [
      {
        id: "2",
        pizzaType: pizzaTypes[1],
        flavor: pizzaFlavors[6],
        extras: [pizzaExtras[2]],
        observations: "",
        quantity: 2,
        totalPrice: 46.0,
      },
    ],
    customer: {
      name: "Maria Santos",
      whatsapp: "(11) 88888-8888",
      cpf: "987.654.321-00",
      birthDate: "1985-05-15",
      email: "maria@email.com",
    },
    deliveryType: "pickup",
    payment: {
      method: "cash",
    },
    status: "received",
    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    estimatedDeliveryTime: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes from now
    totalAmount: 46.0,
  },
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  todayOrders: 15,
  weeklyOrders: 89,
  monthlyOrders: 356,
  pendingOrders: 8,
  revenue: {
    today: 450.5,
    week: 2890.75,
    month: 12567.9,
  },
};

// Mock admin user
export const mockAdmin = {
  id: "1",
  username: "admin",
  name: "Administrador do Sistema",
};

// Service functions for mock data management
export const MockDataService = {
  // Pizza Types
  getPizzaTypes: () => pizzaTypes,
  addPizzaType: (type: Omit<PizzaType, "id">) => {
    const newType = { ...type, id: Date.now().toString() };
    pizzaTypes.push(newType);
    return newType;
  },
  updatePizzaType: (id: string, updates: Partial<PizzaType>) => {
    const index = pizzaTypes.findIndex((t) => t.id === id);
    if (index !== -1) {
      pizzaTypes[index] = { ...pizzaTypes[index], ...updates };
      return pizzaTypes[index];
    }
    return null;
  },
  deletePizzaType: (id: string) => {
    const index = pizzaTypes.findIndex((t) => t.id === id);
    if (index !== -1) {
      return pizzaTypes.splice(index, 1)[0];
    }
    return null;
  },

  // Pizza Flavors
  getPizzaFlavors: (typeId?: string) =>
    typeId ? pizzaFlavors.filter((f) => f.typeId === typeId) : pizzaFlavors,
  addPizzaFlavor: (flavor: Omit<PizzaFlavor, "id">) => {
    const newFlavor = { ...flavor, id: Date.now().toString() };
    pizzaFlavors.push(newFlavor);
    return newFlavor;
  },
  updatePizzaFlavor: (id: string, updates: Partial<PizzaFlavor>) => {
    const index = pizzaFlavors.findIndex((f) => f.id === id);
    if (index !== -1) {
      pizzaFlavors[index] = { ...pizzaFlavors[index], ...updates };
      return pizzaFlavors[index];
    }
    return null;
  },
  deletePizzaFlavor: (id: string) => {
    const index = pizzaFlavors.findIndex((f) => f.id === id);
    if (index !== -1) {
      return pizzaFlavors.splice(index, 1)[0];
    }
    return null;
  },

  // Pizza Extras
  getPizzaExtras: () => pizzaExtras,
  addPizzaExtra: (extra: Omit<PizzaExtra, "id">) => {
    const newExtra = { ...extra, id: Date.now().toString() };
    pizzaExtras.push(newExtra);
    return newExtra;
  },
  updatePizzaExtra: (id: string, updates: Partial<PizzaExtra>) => {
    const index = pizzaExtras.findIndex((e) => e.id === id);
    if (index !== -1) {
      pizzaExtras[index] = { ...pizzaExtras[index], ...updates };
      return pizzaExtras[index];
    }
    return null;
  },
  deletePizzaExtra: (id: string) => {
    const index = pizzaExtras.findIndex((e) => e.id === id);
    if (index !== -1) {
      return pizzaExtras.splice(index, 1)[0];
    }
    return null;
  },

  // Orders
  getOrders: () => mockOrders,
  getOrder: (id: string) => mockOrders.find((o) => o.id === id),
  addOrder: (order: Omit<Order, "id">) => {
    const newOrder = { ...order, id: Date.now().toString() };
    mockOrders.unshift(newOrder);
    return newOrder;
  },
  updateOrderStatus: (id: string, status: OrderStatus) => {
    const order = mockOrders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  },

  // Dashboard
  getDashboardStats: () => mockDashboardStats,

  // Auth
  login: (username: string, password: string) => {
    if (username === "admin" && password === "admin123") {
      return mockAdmin;
    }
    return null;
  },
};
