import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PizzaCard } from "@/components/PizzaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/services/apiService";
import { PizzaType } from "@/types";

export const HomePage = () => {
  const navigate = useNavigate();
  const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      setIsLoading(true);
      try {
        const types = await api.public.getPizzaTypes();
        setPizzaTypes(Array.isArray(types) ? types : []);
      } catch (error) {
        console.error("Failed to fetch pizza types:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTypes();
  }, []);

  const handleSelectPizza = (pizzaType: PizzaType) => {
    navigate("/customize", { state: { pizzaType } });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">As Melhores Pizzas da Cidade!</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Ingredientes frescos, massa artesanal e entrega rápida.</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Escolha o Tamanho da sua Pizza</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [...Array(3)].map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-lg" />)
            ) : (
              pizzaTypes.map((pizzaType) => (
                <PizzaCard key={pizzaType.id} pizzaType={pizzaType} onSelect={handleSelectPizza} />
              ))
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};