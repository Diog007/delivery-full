// src/components/drinks/CartSummary.tsx
import React from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { CartItem } from '../../types'; // Ajustado para o caminho correto
import { useCart } from '../../contexts/CartContext'; // Ajustado para o caminho correto

export const CartSummary: React.FC = () => {
    const { items, clearCart } = useCart();

    const beverageItems = items.filter(item => item.type === 'beverage');
    const totalItems = beverageItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = beverageItems.reduce((sum, item) => sum + item.totalPrice, 0);

    if (totalItems === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 max-w-sm z-40">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <ShoppingCart className="text-white" size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">Carrinho de Bebidas</h3>
                    <p className="text-sm text-gray-600">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</p>
                </div>
            </div>

            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                {beverageItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="truncate mr-2">{item.name}</span>
                        <span className="font-medium">
                            {item.quantity}x R$ {(item.totalPrice).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">Total (Bebidas):</span>
                    <span className="font-bold text-lg text-orange-500">
                        R$ {totalPrice.toFixed(2)}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={clearCart}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <Trash2 size={16} />
                        Limpar Tudo
                    </button>
                    <a href="/cart" className="flex-2 text-center bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-xl font-medium transition-colors">
                        Ver Carrinho
                    </a>
                </div>
            </div>
        </div>
    );
};