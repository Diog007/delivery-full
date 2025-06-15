import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Beverage } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, GlassWater } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface BeverageCardProps {
  beverage: Beverage;
}

export const BeverageCard = ({ beverage }: BeverageCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addBeverageToCart } = useCart();

  const handleAddToCart = () => {
    addBeverageToCart(beverage, quantity);
    // Opcional: mostrar um toast de confirmação
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
          {beverage.imageUrl ? (
            <img src={`http://localhost:8090${beverage.imageUrl}`} alt={beverage.name} className="w-full h-full object-cover" />
          ) : (
            <GlassWater className="h-16 w-16 text-gray-300" />
          )}
        </div>
        <CardTitle>{beverage.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-4">{beverage.description}</p>
        <p className="font-semibold text-lg">{formatPrice(beverage.price)}</p>
      </CardContent>
      <CardFooter className="flex-col items-stretch space-y-2">
         <div className="flex items-center justify-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
            <span className="font-bold w-8 text-center">{quantity}</span>
            <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
         </div>
        <Button onClick={handleAddToCart} className="w-full bg-red-600 hover:bg-red-700">Adicionar</Button>
      </CardFooter>
    </Card>
  );
};