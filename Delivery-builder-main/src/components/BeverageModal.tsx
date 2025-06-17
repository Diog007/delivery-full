import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/services/apiService';
import { Beverage } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, ShoppingCart, GripVertical, GlassWater } from 'lucide-react';
import { toast } from './ui/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

export const BeverageModal = ({ open, onOpenChange }) => {
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBeverage, setSelectedBeverage] = useState<Beverage | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addBeverageToCart } = useCart();

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      api.public.getBeverages()
        .then(drinks => setBeverages(Array.isArray(drinks) ? drinks : []))
        .catch(err => console.error("Erro ao buscar bebidas:", err))
        .finally(() => setIsLoading(false));
    } else {
      setSelectedBeverage(null);
      setQuantity(1);
    }
  }, [open]);

  const groupedBeverages = beverages.reduce((acc, beverage) => {
    const category = beverage.category || 'Outros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(beverage);
    return acc;
  }, {} as Record<string, Beverage[]>);

  const categories = Object.keys(groupedBeverages);

  const handleSelectBeverage = (beverage: Beverage) => {
    setSelectedBeverage(beverage);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedBeverage) return;
    addBeverageToCart(selectedBeverage, quantity);
    toast({
      title: "Bebida adicionada!",
      description: `${quantity}x ${selectedBeverage.name} adicionada(s) ao carrinho.`,
    });
  };

  const FridgeSkeleton = () => (
    <div className="space-y-8 p-6">
      {[...Array(2)].map((_, i) => (
        <div key={i}>
          <Skeleton className="h-6 w-32 mb-3" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, j) => <Skeleton key={j} className="aspect-square rounded-xl" />)}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 bg-white rounded-2xl shadow-xl flex overflow-hidden">
        {/* Painel lateral */}
        <div className="w-80 bg-gradient-to-b from-red-50 to-red-100 p-6 border-r border-red-200 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-red-600">Bebidas</h2>
            <div className="bg-white p-4 rounded-xl border text-center shadow-sm min-h-[120px] flex flex-col items-center justify-center">
              {selectedBeverage ? (
                <>
                  <img src={`http://localhost:8090${selectedBeverage.imageUrl}`} alt={selectedBeverage.name} className="max-h-20 mb-2 object-contain" />
                  <p className="font-semibold text-gray-700 text-sm">{selectedBeverage.name}</p>
                </>
              ) : (
                <p className="text-sm text-gray-400">Selecione uma bebida</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Quantidade</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={!selectedBeverage}><Minus className="w-4 h-4" /></Button>
                <span className="font-bold w-6 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)} disabled={!selectedBeverage}><Plus className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {selectedBeverage && (
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total:</span>
                <span>{formatPrice(selectedBeverage.price * quantity)}</span>
              </div>
            )}
            <Button disabled={!selectedBeverage} onClick={handleAddToCart} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold">
              <ShoppingCart className="w-5 h-5 mr-2" /> Adicionar
            </Button>
          </div>
        </div>

        {/* Galeria de bebidas */}
        <div className="flex-1 bg-gradient-to-br from-white to-gray-50 p-6 overflow-y-auto">
          {isLoading ? <FridgeSkeleton /> : (
            <div className="space-y-10">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-xl font-semibold text-red-700 border-b-2 border-red-200 pb-2 mb-4">{category}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {groupedBeverages[category].map(bev => (
                      <motion.button
                        key={bev.id}
                        onClick={() => handleSelectBeverage(bev)}
                        whileHover={{ scale: 1.05 }}
                        className={cn(
                          'bg-white rounded-xl p-3 shadow hover:shadow-md transition-all flex flex-col items-center text-center',
                          selectedBeverage?.id === bev.id && 'border-2 border-red-500 bg-red-50'
                        )}
                      >
                        {bev.imageUrl ? (
                          <img src={`http://localhost:8090${bev.imageUrl}`} alt={bev.name} className="h-24 object-contain mb-2" />
                        ) : (
                          <GlassWater className="h-10 w-10 text-gray-400 mb-2" />
                        )}
                        <p className="text-sm font-medium text-gray-700 truncate w-full">{bev.name}</p>
                        <span className="text-xs text-gray-500">{formatPrice(bev.price)}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};