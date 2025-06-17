import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PizzaCard } from "@/components/PizzaCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/services/apiService";
import { useCart } from "@/contexts/CartContext";
import { PizzaType, Beverage, BeverageCategory } from "@/types";
import { Droplets, ArrowLeft, GlassWater } from 'lucide-react';
import { CategoryFilter } from '@/components/drinks/CategoryFilter';
import { SearchBar } from '@/components/drinks/SearchBar';
import { DrinkCard } from '@/components/drinks/DrinkCard';
import { CartSummary } from '@/components/drinks/CartSummary';

export const HomePage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'pizzas' | 'beverages'>('pizzas');

  const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([]);
  const [isLoadingPizzas, setIsLoadingPizzas] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      setIsLoadingPizzas(true);
      try {
        const types = await api.public.getPizzaTypes();
        setPizzaTypes(Array.isArray(types) ? types : []);
      } catch (error) {
        console.error("Failed to fetch pizza types:", error);
      } finally {
        setIsLoadingPizzas(false);
      }
    };
    if (view === 'pizzas') {
      fetchTypes();
    }
  }, [view]);

  const [allBeverages, setAllBeverages] = useState<Beverage[]>([]);
  const [beverageCategories, setBeverageCategories] = useState<BeverageCategory[]>([]);
  const [isLoadingBeverages, setIsLoadingBeverages] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { items, addBeverageToCart, updateItemQuantity } = useCart();

  useEffect(() => {
    if (view === 'beverages') {
      const fetchBeverageData = async () => {
        setIsLoadingBeverages(true);
        try {
          const [drinks, categories] = await Promise.all([
            api.public.getBeverages(),
            api.public.getBeverageCategories(),
          ]);
          setAllBeverages(Array.isArray(drinks) ? drinks : []);
          setBeverageCategories(Array.isArray(categories) ? categories : []);
        } catch (error) {
          console.error("Failed to fetch beverage data:", error);
        } finally {
          setIsLoadingBeverages(false);
        }
      };
      fetchBeverageData();
    }
  }, [view]);

  const filteredDrinks = useMemo(() => {
    let filtered = allBeverages;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(drink => drink.category?.id === selectedCategory);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(drink =>
        drink.name.toLowerCase().includes(term) ||
        drink.description.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [selectedCategory, searchTerm, allBeverages]);
  
  const cartQuantities = useMemo(() => {
    const quantities = new Map<string, number>();
    items.filter(item => item.type === 'beverage' && item.beverage)
         .forEach(item => {
            quantities.set(item.beverage!.id, (quantities.get(item.beverage!.id) || 0) + item.quantity);
         });
    return quantities;
  }, [items]);

  const handleQuantityChange = (drink: Beverage, newQuantity: number) => {
    const existingItem = items.find(item => item.beverage?.id === drink.id && item.type === 'beverage');
    if (existingItem) {
      updateItemQuantity(existingItem.id, newQuantity);
    } else if (newQuantity > 0) {
      addBeverageToCart(drink, newQuantity);
    }
  };


  const PizzaContent = () => (
    <>
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">As Melhores Pizzas da Cidade!</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Ingredientes frescos, massa artesanal e entrega rápida.</p>
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600" onClick={() => setView('beverages')}>
          <GlassWater className="mr-2 h-5 w-5" /> Ver Bebidas
        </Button>
      </section>
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Escolha o Tamanho da sua Pizza</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {isLoadingPizzas ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-lg" />)
          ) : (
            pizzaTypes.map((pizzaType) => (
              <PizzaCard key={pizzaType.id} pizzaType={pizzaType} onSelect={(pt) => navigate("/customize", { state: { pizzaType: pt } })} />
            ))
          )}
        </div>
      </section>
    </>
  );

  const BeverageContent = () => (
    <section>
      <Button variant="ghost" onClick={() => setView('pizzas')} className="mb-8 text-lg">
        <ArrowLeft className="h-5 w-5 mr-2" /> Voltar para Pizzas
      </Button>
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 bg-orange-100 px-6 py-3 rounded-full mb-6">
            <Droplets className="text-orange-500" size={24} />
            <span className="font-medium text-orange-700">Nossas Bebidas</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Mate sua sede com o que há de melhor</h1>
      </div>
      <div className="mb-8">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <CategoryFilter
          categories={beverageCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      {isLoadingBeverages ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-2xl" />)}
        </div>
      ) : filteredDrinks.length > 0 ? (
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
        <div className="text-center py-16 text-gray-500">Nenhuma bebida encontrada.</div>
      )}
      <CartSummary />
    </section>
  );

  return (
    <Layout onNavigateToBeverages={() => setView('beverages')}>
      <div className="container mx-auto px-4 py-8">
        {view === 'pizzas' ? <PizzaContent /> : <BeverageContent />}
      </div>
    </Layout>
  );
};