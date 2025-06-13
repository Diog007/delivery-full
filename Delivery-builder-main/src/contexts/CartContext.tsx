import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, PizzaType, PizzaFlavor, PizzaExtra, PizzaCrust } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (
    pizzaType: PizzaType,
    flavors: PizzaFlavor[], // MODIFICADO
    crust: PizzaCrust | null,
    extras: PizzaExtra[],
    observations: string,
    quantity: number,
  ) => void;
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
    flavors: PizzaFlavor[], // MODIFICADO
    crust: PizzaCrust | null,
    extras: PizzaExtra[],
    observations: string,
    quantity: number,
  ) => {
    // --- LÓGICA DE PREÇO ATUALIZADA ---
    const highestFlavorPrice = flavors.length > 0
        ? Math.max(...flavors.map(f => f.price))
        : 0;
    const extrasPrice = extras.reduce((sum, extra) => sum + extra.price, 0);
    const crustPrice = crust ? crust.price : 0;
    
    const totalPrice = (pizzaType.basePrice + highestFlavorPrice + extrasPrice + crustPrice) * quantity;
    // --- FIM DA LÓGICA DE PREÇO ---

    const newItem: CartItem = {
      id: Date.now().toString(),
      pizzaType,
      flavors, // MODIFICADO
      crust,
      extras,
      observations,
      quantity,
      totalPrice,
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
          return {
            ...item,
            quantity,
            totalPrice: unitPrice * quantity,
          };
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