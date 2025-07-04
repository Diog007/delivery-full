import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Pizza, GlassWater } from "lucide-react";
import { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {

  // Adicionando verificação de segurança
  if (!item.item) {
    console.error("CartItem recebeu um item inválido:", item);
    return null; // Não renderiza nada se o item for inválido
  }

  if (item.item.itemType === 'BEVERAGE') {
    const { beverage } = item.item;
    return (
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center gap-4">
            {beverage.imageUrl ? (
              <img src={`http://localhost:8090${beverage.imageUrl}`} alt={beverage.name} className="w-16 h-16 object-contain rounded-md" />
            ) : (
              <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                <GlassWater className="h-8 w-8" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{beverage.name}</h3>
              <p className="text-sm text-gray-600">{formatPrice(beverage.price)} / unidade</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus className="h-4 w-4" /></Button>
              <span className="font-bold w-6 text-center">{item.quantity}</span>
              <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-col items-end">
                <p className="font-bold text-lg text-gray-900">{formatPrice(item.totalPrice)}</p>
                <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // --- Renderização para Pizza ---
  const { pizzaType, flavors, crust, appliedExtras } = item.item;
  const unitPrice = item.totalPrice / item.quantity;
  const isHalfAndHalf = flavors.length > 1;

  return (
    <Card className="mb-4 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          {/* Coluna de Detalhes da Pizza e Preços */}
          <div className="flex items-start gap-4 flex-1">
            {pizzaType.imageUrl ? (
              <img src={`http://localhost:8090${pizzaType.imageUrl}`} alt={pizzaType.name} className="w-20 h-20 rounded-md object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                <Pizza className="h-8 w-8" />
              </div>
            )}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{pizzaType.name}</h3>
                <p className="text-sm font-medium text-red-600">
                  {flavors.map(f => f.name).join(' / ')}
                </p>
              </div>

              {/* Detalhes do Preço Unitário */}
              <div className="text-sm border-l-2 border-gray-200 pl-3 py-1 space-y-1">
                  <p className="font-semibold text-gray-700 mb-1">Detalhes do Preço Unitário:</p>
                  <div className="flex justify-between items-center text-gray-600">
                      <span>Pizza Base</span>
                      <span>{formatPrice(pizzaType.basePrice)}</span>
                  </div>
                  {flavors.map(flavor => (
                      <div key={flavor.id} className="flex justify-between items-center text-gray-600">
                          <span>Sabor: {flavor.name} {isHalfAndHalf && '(1/2)'}</span>
                          <span>+ {formatPrice(isHalfAndHalf ? flavor.price / 2 : flavor.price)}</span>
                      </div>
                  ))}
                  {crust && (
                       <div className="flex justify-between items-center text-gray-600">
                          <span>Borda: {crust.name}</span>
                          <span>+ {formatPrice(crust.price)}</span>
                      </div>
                  )}
                  {appliedExtras.map((applied, index) => (
                      <div key={index} className="flex justify-between items-center text-gray-600">
                         <span>
                           Adicional: {applied.extra.name}
                           <span className="text-gray-500 text-xs ml-1">
                              ({applied.onFlavor ? `Metade ${applied.onFlavor.name}` : 'Pizza Toda'})
                           </span>
                         </span>
                         <span>+ {formatPrice(applied.extra.price)}</span>
                     </div>
                  ))}
                  <Separator className="my-2" />
                   <div className="flex justify-between items-center font-semibold text-gray-800">
                      <span>Subtotal Unitário</span>
                      <span>{formatPrice(unitPrice)}</span>
                  </div>
              </div>

              {item.observations && (
                <div className="pt-2">
                  <p className="text-sm font-semibold text-gray-700">Observações:</p>
                  <p className="text-sm text-gray-600 italic">"{item.observations}"</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Coluna de Quantidade e Preço Total */}
          <div className="flex flex-col items-end space-y-3 w-full sm:w-auto self-stretch justify-between">
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus className="h-4 w-4" /></Button>
                <span className="font-bold w-8 text-center text-lg">{item.quantity}</span>
                <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
              </div>
              <p className="font-bold text-xl text-gray-900 mt-2">{formatPrice(item.totalPrice)}</p>
            </div>
            
            <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)} className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Remover
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};