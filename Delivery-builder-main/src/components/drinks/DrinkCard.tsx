// src/components/drinks/DrinkCard.tsx
import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Beverage } from '../../types'; // Ajustado para o caminho correto
import { useCart } from '../../contexts/CartContext'; // Ajustado para o caminho correto

interface DrinkCardProps {
  drink: Beverage;
  quantity: number;
  onQuantityChange: (drink: Beverage, newQuantity: number) => void;
}

export const DrinkCard: React.FC<DrinkCardProps> = ({ drink, quantity, onQuantityChange }) => {
  const handleIncrease = () => {
    onQuantityChange(drink, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      onQuantityChange(drink, quantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={drink.imageUrl ? `http://localhost:8090${drink.imageUrl}` : 'https://via.placeholder.com/300'}
          alt={drink.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1">{drink.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{drink.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-orange-500">
            R$ {drink.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {quantity > 0 ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecrease}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold text-lg min-w-[2ch] text-center">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleIncrease}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
            >
              <ShoppingCart size={18} />
              Adicionar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};