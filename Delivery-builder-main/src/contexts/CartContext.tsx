import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, PizzaType, PizzaFlavor, PizzaCrust, AppliedExtra, Beverage } from "@/types";

// 1. Adicionada a assinatura da função que estava faltando
interface CartContextType {
  items: CartItem[];
  addItem: (
    pizzaType: PizzaType,
    flavors: PizzaFlavor[],
    crust: PizzaCrust | null,
    appliedExtras: AppliedExtra[],
    observations: string,
    quantity: number,
  ) => void;
  addBeverageToCart: (beverage: Beverage, quantity: number) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (
    pizzaType: PizzaType,
    flavors: PizzaFlavor[],
    crust: PizzaCrust | null,
    appliedExtras: AppliedExtra[],
    observations: string,
    quantity: number,
  ) => {
    const isHalfAndHalf = flavors.length > 1;
    
    const flavorPrice = flavors.reduce((sum, flavor) => {
      return sum + (isHalfAndHalf ? flavor.price / 2 : flavor.price);
    }, 0);

    const extrasPrice = appliedExtras.reduce((sum, applied) => sum + applied.extra.price, 0);
    const crustPrice = crust ? crust.price : 0;
    
    const totalPrice = (pizzaType.basePrice + flavorPrice + extrasPrice + crustPrice) * quantity;

    const newItem: CartItem = {
      id: `pizza-${Date.now()}`,
      type: 'pizza',
      name: `${pizzaType.name} (${flavors.map(f => f.name).join(' / ')})`,
      pizzaType,
      flavors,
      crust,
      appliedExtras,
      observations,
      quantity,
      totalPrice,
    };

    setItems((prev) => [...prev, newItem]);
  };

  // 2. Implementação da lógica da função
  const addBeverageToCart = (beverage: Beverage, quantity: number) => {
    const newItem: CartItem = {
        id: `beverage-${beverage.id}-${Date.now()}`,
        type: 'beverage',
        name: beverage.name,
        beverage: beverage,
        observations: '',
        quantity: quantity,
        totalPrice: beverage.price * quantity,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const unitPrice = item.totalPrice / item.quantity;
          return { ...item, quantity, totalPrice: unitPrice * quantity };
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addBeverageToCart, // 3. Disponibilização da função para os componentes filhos
        removeItem,
        updateItemQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};