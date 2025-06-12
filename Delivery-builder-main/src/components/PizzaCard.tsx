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
import { formatPrice } from "@/lib/utils";
import { Pizza } from "lucide-react";

interface PizzaCardProps {
  pizzaType: PizzaType;
  onSelect: (pizzaType: PizzaType) => void;
}

export const PizzaCard = ({ pizzaType, onSelect }: PizzaCardProps) => {

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group flex flex-col">
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

      <CardContent className="flex-grow flex flex-col">
        <p className="text-gray-600 text-sm mb-4">{pizzaType.description}</p>
        
        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
          {pizzaType.imageUrl ? (
            <img src={`http://localhost:8090${pizzaType.imageUrl}`} alt={pizzaType.name} className="w-full h-full object-cover" />
          ) : (
            <Pizza className="h-16 w-16 text-gray-300" />
          )}
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