import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Droplets } from 'lucide-react';
import { Beverage, BeverageCategory } from '@/types';
import { api } from '@/services/apiService';
import { CategoryFilter } from '@/components/drinks/CategoryFilter';
import { SearchBar } from '@/components/drinks/SearchBar';
import { BeverageCard } from '@/components/BeverageCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BeverageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const BeverageModal: React.FC<BeverageModalProps> = ({ open, onOpenChange }) => {
    const [allBeverages, setAllBeverages] = useState<Beverage[]>([]);
    const [categories, setCategories] = useState<BeverageCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (open) {
            setIsLoading(true);
            const fetchBeverageData = async () => {
                try {
                    const [drinks, fetchedCategories] = await Promise.all([
                        api.public.getBeverages(),
                        api.public.getBeverageCategories(),
                    ]);
                    setAllBeverages(Array.isArray(drinks) ? drinks : []);
                    setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
                } catch (error) {
                    console.error("Failed to fetch beverage data:", error);
                    setAllBeverages([]);
                    setCategories([]);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchBeverageData();
        }
    }, [open]);

    const filteredDrinks = useMemo(() => {
        return allBeverages
            .filter(drink => selectedCategory === 'all' || drink.category?.id === selectedCategory)
            .filter(drink =>
                drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (drink.description && drink.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
    }, [selectedCategory, searchTerm, allBeverages]);

    const DrinkGridSkeleton = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                    <Skeleton className="h-24 w-24 rounded-lg" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-9 w-full" />
                </div>
            ))}
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                       <Droplets className="text-red-600 h-6 w-6"/> Bebidas
                    </DialogTitle>
                    <DialogDescription>
                        Escolha as bebidas para acompanhar sua pizza. Elas serão adicionadas ao seu carrinho.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="px-6 py-4">
                     <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                     <CategoryFilter 
                        categories={categories} 
                        selectedCategory={selectedCategory} 
                        onCategoryChange={setSelectedCategory}
                     />
                </div>
                
                <ScrollArea className="flex-1 px-6">
                   <div className="pb-6">
                    {isLoading ? (
                        <DrinkGridSkeleton />
                    ) : filteredDrinks.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredDrinks.map((drink) => (
                                <BeverageCard
                                    key={drink.id}
                                    beverage={drink}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-500">
                            <p>Nenhuma bebida encontrada. Tente alterar os filtros.</p>
                        </div>
                    )}
                   </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};