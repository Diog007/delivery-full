import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types";

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
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const unitPrice = item.totalPrice / item.quantity;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-gray-900">
                {item.pizzaType.name}
              </h3>
              <Badge variant="secondary">{item.flavor.name}</Badge>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              {item.flavor.description}
            </p>

            {item.extras.length > 0 && (
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Adicionais:
                </p>
                <div className="flex flex-wrap gap-1">
                  {item.extras.map((extra) => (
                    <Badge key={extra.id} variant="outline" className="text-xs">
                      {extra.name} (+{formatPrice(extra.price)})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {item.observations && (
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700">
                  Observações:
                </p>
                <p className="text-sm text-gray-600">{item.observations}</p>
              </div>
            )}

            <div className="text-sm text-gray-600">
              Preço unitário: {formatPrice(unitPrice)}
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>

              <span className="font-medium w-8 text-center">
                {item.quantity}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="font-semibold text-lg">
              {formatPrice(item.totalPrice)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
