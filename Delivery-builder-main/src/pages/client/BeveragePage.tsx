// src/pages/client/BeveragePage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Droplets } from 'lucide-react';
import { DrinkCategory, Beverage } from '@/types';
import { api } from '@/services/apiService';
import { useCart } from '@/contexts/CartContext';

// Importando os novos componentes
import { CategoryFilter } from '@/components/drinks/CategoryFilter';
import { SearchBar } from '@/components/drinks/SearchBar';
import { DrinkCard } from '@/components/drinks/DrinkCard';
import { CartSummary } from '@/components/drinks/CartSummary';
import { Skeleton } from '@/components/ui/skeleton';

export const BeveragePage: React.FC = () => {
    // Estados locais para a página
    const [allBeverages, setAllBeverages] = useState<Beverage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<DrinkCategory | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Usando o CartContext global
    const { items, addBeverageToCart, updateItemQuantity } = useCart();

    // Busca as bebidas da API
    useEffect(() => {
        const fetchBeverages = async () => {
            setIsLoading(true);
            try {
                const drinks = await api.public.getBeverages();
                // Simula a categoria, já que não vem do backend ainda
                const drinksWithCategory = (Array.isArray(drinks) ? drinks : []).map(drink => ({
                    ...drink,
                    // Lógica de exemplo para atribuir categorias
                    category: drink.name.toLowerCase().includes('coca') || drink.name.toLowerCase().includes('guaraná') ? 'refrigerante' :
                              drink.name.toLowerCase().includes('heineken') || drink.name.toLowerCase().includes('cerveja') ? 'cerveja' :
                              drink.name.toLowerCase().includes('suco') ? 'suco' : 'agua'
                })) as Beverage[];
                setAllBeverages(drinksWithCategory);
            } catch (error) {
                console.error("Failed to fetch beverages:", error);
                setAllBeverages([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBeverages();
    }, []);


    const filteredDrinks = useMemo(() => {
        let filtered = allBeverages;

        // Filtro por categoria
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(drink => drink.category === selectedCategory);
        }

        // Filtro por termo de busca
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(drink =>
                drink.name.toLowerCase().includes(term) ||
                drink.description.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [selectedCategory, searchTerm, allBeverages]);
    
    // Mapeia os itens do carrinho para obter as quantidades de cada bebida
    const cartQuantities = useMemo(() => {
        const quantities = new Map<string, number>();
        items.filter(item => item.type === 'beverage' && item.beverage)
             .forEach(item => {
                quantities.set(item.beverage!.id, (quantities.get(item.beverage!.id) || 0) + item.quantity);
             });
        return quantities;
    }, [items]);

    // Função para lidar com a mudança de quantidade
    const handleQuantityChange = (drink: Beverage, newQuantity: number) => {
        const existingItem = items.find(item => item.beverage?.id === drink.id);
        
        if (existingItem) {
            updateItemQuantity(existingItem.id, newQuantity);
        } else if (newQuantity > 0) {
            addBeverageToCart(drink, newQuantity);
        }
    };

    const DrinkGridSkeleton = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </div>
    );

    return (
        <Layout>
            <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 py-16 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 bg-orange-100 px-6 py-3 rounded-full mb-6">
                            <Droplets className="text-orange-500" size={24} />
                            <span className="font-medium text-orange-700">Nossas Bebidas</span>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">Mate sua sede com o que há de melhor</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Selecionamos as melhores bebidas para acompanhar sua pizza.</p>
                    </div>

                    <div className="mb-8">
                        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
                    </div>

                    <div className="mb-8">
                        <p className="text-gray-600">
                            {isLoading ? 'Buscando bebidas...' : 
                             `${filteredDrinks.length} ${filteredDrinks.length === 1 ? 'bebida encontrada' : 'bebidas encontradas'}`}
                        </p>
                    </div>
                    
                    {isLoading ? <DrinkGridSkeleton /> : filteredDrinks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                            {filteredDrinks.map((drink) => (
                                <DrinkCard
                                    key={drink.id}
                                    drink={drink}
                                    quantity={cartQuantities.get(drink.id) || 0}
                                    onQuantityChange={handleQuantityChange}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Droplets className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma bebida encontrada</h3>
                            <p className="text-gray-500">Tente ajustar sua busca ou filtros.</p>
                        </div>
                    )}
                    
                    <CartSummary />
                </div>
            </section>
        </Layout>
    );
};