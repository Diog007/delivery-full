import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { BeverageCard } from "@/components/BeverageCard";
import { Beverage } from "@/types";
import { api } from "@/services/apiService";
import { GlassWater } from "lucide-react";

export const BeveragePage = () => {
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBeverages = async () => {
      setIsLoading(true);
      try {
        const drinks = await api.public.getBeverages();
        setBeverages(Array.isArray(drinks) ? drinks : []);
      } catch (error) {
        console.error("Failed to fetch beverages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBeverages();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
            <div className="flex justify-center items-center mb-4">
                <GlassWater className="h-12 w-12 text-red-600" />
            </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Nossas Bebidas
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha a bebida perfeita para acompanhar sua pizza.
          </p>
        </section>

        <section>
          {isLoading ? (
            <p className="text-center">Carregando bebidas...</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {beverages.map((beverage) => (
                <BeverageCard key={beverage.id} beverage={beverage} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};