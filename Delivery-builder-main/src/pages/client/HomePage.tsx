import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PizzaCard } from "@/components/PizzaCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PizzaType } from "@/types";
import { api } from "@/services/apiService";

export const HomePage = () => {
  const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await api.public.getPizzaTypes();
        // Garante que a resposta seja um array antes de setar o estado
        if (Array.isArray(types)) {
          setPizzaTypes(types);
        } else {
          setPizzaTypes([]);
        }
      } catch (error) {
        console.error("Failed to fetch pizza types:", error);
        setPizzaTypes([]); // Define como vazio em caso de erro
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
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            As Melhores Pizzas da Cidade!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ingredientes frescos, massa artesanal e entrega rápida. Escolha sua
            pizza favorita e tenha uma experiência incrível.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-800 font-semibold">
              🕒 Tempo de entrega: 30-45 min
            </p>
            <p className="text-red-600 text-sm">
              Entrega grátis em pedidos acima de R$ 40
            </p>
          </div>
        </section>

        {/* Featured Offers */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Ofertas Especiais
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <CardHeader>
                <CardTitle className="text-2xl">Combo Família</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">2 Pizzas Grandes + Refrigerante 2L</p>
                <p className="text-3xl font-bold">R$ 65,90</p>
                <p className="text-sm opacity-90">Economize R$ 15,00</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardHeader>
                <CardTitle className="text-2xl">Pizza Doce</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Sobremesa perfeita para finalizar</p>
                <p className="text-3xl font-bold">A partir de R$ 22,00</p>
                <p className="text-sm opacity-90">Várias opções disponíveis</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pizza Types Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Escolha o Tamanho da sua Pizza
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {pizzaTypes.map((pizzaType) => (
              <PizzaCard
                key={pizzaType.id}
                pizzaType={pizzaType}
                onSelect={handleSelectPizza}
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-16 py-12 bg-white rounded-lg shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher a PizzaExpress?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🍕</div>
              <h3 className="text-xl font-semibold mb-2">
                Ingredientes Frescos
              </h3>
              <p className="text-gray-600">
                Utilizamos apenas ingredientes selecionados e frescos para
                garantir o melhor sabor.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">
                Sua pizza chega quentinha em até 45 minutos, com acompanhamento
                em tempo real.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">
                Qualidade Garantida
              </h3>
              <p className="text-gray-600">
                Mais de 10 anos de experiência preparando as melhores pizzas da
                região.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};