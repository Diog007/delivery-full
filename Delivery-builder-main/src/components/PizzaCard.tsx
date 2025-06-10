import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PizzaType } from "@/types";

interface PizzaCardProps {
  pizzaType: PizzaType;
  onSelect: (pizzaType: PizzaType) => void;
}

export const PizzaCard = ({ pizzaType, onSelect }: PizzaCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
            {pizzaType.name}
          </CardTitle>
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            A partir de {formatPrice(pizzaType.basePrice)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 text-sm mb-4">{pizzaType.description}</p>

        {/* Pizza illustration placeholder */}
        <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center mb-4">
          <div className="text-4xl">🍕</div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full bg-red-600 hover:bg-red-700"
          onClick={() => onSelect(pizzaType)}
        >
          Escolher Sabores
        </Button>
      </CardFooter>
    </Card>
  );
};
