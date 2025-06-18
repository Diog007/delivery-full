import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { CartItem, PizzaType, PizzaFlavor, PizzaCrust, AppliedExtra, Beverage } from "@/types";
import { toast } from "@/components/ui/use-toast";

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

  const addItem = useCallback((
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

    // CORREÇÃO: Criando o item com a estrutura aninhada correta
    const newItem: CartItem = {
      id: `pizza-${Date.now()}`,
      name: `${pizzaType.name} (${flavors.map(f => f.name).join(' / ')})`,
      observations,
      quantity,
      totalPrice,
      item: {
          itemType: 'PIZZA',
          pizzaType,
          flavors,
          crust,
          appliedExtras,
      },
    };

    setItems((prev) => [...prev, newItem]);
  }, []);

  const addBeverageToCart = useCallback((beverage: Beverage, quantity: number) => {
    setItems((prevItems) => {
        // CORREÇÃO: A verificação agora olha dentro de `item.beverage`
        const existingItemIndex = prevItems.findIndex(
            (cartItem) => cartItem.item.itemType === 'BEVERAGE' && cartItem.item.beverage.id === beverage.id
        );

        if (existingItemIndex > -1) {
            const updatedItems = [...prevItems];
            const existingItem = updatedItems[existingItemIndex];
            const newQuantity = existingItem.quantity + quantity;
            existingItem.quantity = newQuantity;
            existingItem.totalPrice = existingItem.item.beverage.price * newQuantity;
            
            toast({
                title: "Item atualizado!",
                description: `${beverage.name} agora tem ${newQuantity} unidade(s) no carrinho.`,
            });
            return updatedItems;

        } else {
            // CORREÇÃO: Criando o item com a estrutura aninhada correta
            const newItem: CartItem = {
                id: `beverage-${beverage.id}-${Date.now()}`,
                name: beverage.name,
                observations: '',
                quantity,
                totalPrice: beverage.price * quantity,
                item: {
                    itemType: 'BEVERAGE',
                    beverage,
                },
            };
            toast({
                title: "Bebida adicionada!",
                description: `${quantity}x ${beverage.name} foi adicionado(a) ao seu carrinho.`,
            });
            return [...prevItems, newItem];
        }
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItemQuantity = useCallback((id: string, quantity: number) => {
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
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addBeverageToCart,
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