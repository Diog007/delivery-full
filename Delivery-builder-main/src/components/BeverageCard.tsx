import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Beverage } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

interface BeverageCardProps {
  beverage: Beverage;
}

export const BeverageCard = ({ beverage }: BeverageCardProps) => {
  const { addBeverageToCart } = useCart(); // Correção aqui
  const { toast } = useToast();

  const handleAddToCart = () => {
    addBeverageToCart(beverage, 1); // Correção aqui
    // A notificação de toast foi movida para dentro do context para mais consistência
  };

  return (
    <Card className="flex flex-col text-center items-center p-4 transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0 mb-3">
        {beverage.imageUrl ? (
          <img
            src={`http://localhost:8090${beverage.imageUrl}`}
            alt={beverage.name}
            className="w-24 h-24 object-contain"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
             <span className="text-4xl">🥤</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-0 text-center">
        <CardTitle className="text-base font-semibold">{beverage.name}</CardTitle>
        {beverage.description && (
          <p className="text-sm text-gray-500 mt-1">{beverage.description}</p>
        )}
        <p className="text-lg font-bold text-red-600 mt-2">{formatPrice(beverage.price)}</p>
      </CardContent>
      <CardFooter className="p-0 mt-3 w-full">
        <Button onClick={handleAddToCart} size="sm" className="w-full bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
};