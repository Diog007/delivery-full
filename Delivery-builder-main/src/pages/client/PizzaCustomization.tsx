import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { PizzaType, PizzaFlavor, PizzaExtra } from "@/types";
import { api } from "@/services/apiService";
import { useCart } from "@/contexts/CartContext";

export const PizzaCustomization = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const pizzaType = location.state?.pizzaType as PizzaType;

  const [flavors, setFlavors] = useState<PizzaFlavor[]>([]);
  const [extras, setExtras] = useState<PizzaExtra[]>([]);
  const [selectedFlavor, setSelectedFlavor] = useState<PizzaFlavor | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<PizzaExtra[]>([]);
  const [observations, setObservations] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!pizzaType) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const allFlavors = await api.public.getPizzaFlavors();
        const extrasData = await api.public.getPizzaExtras();
        
        const flavorsForType = Array.isArray(allFlavors) 
          ? allFlavors.filter(flavor => flavor.pizzaType?.id === pizzaType.id) 
          : [];

        setFlavors(flavorsForType);
        setExtras(Array.isArray(extrasData) ? extrasData : []);

        if (flavorsForType.length > 0) {
          setSelectedFlavor(flavorsForType[0]);
        }
      } catch (error) {
        console.error("Failed to fetch customization data:", error);
      }
    };

    fetchData();
  }, [pizzaType, navigate]);

  const handleExtraToggle = (extra: PizzaExtra, checked: boolean) => {
    if (checked) {
      setSelectedExtras((prev) => [...prev, extra]);
    } else {
      setSelectedExtras((prev) => prev.filter((e) => e.id !== extra.id));
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedFlavor || !pizzaType) return 0;

    const basePrice = pizzaType.basePrice;
    const flavorPrice = selectedFlavor.price;
    const extrasPrice = selectedExtras.reduce(
      (sum, extra) => sum + extra.price,
      0,
    );

    return (basePrice + flavorPrice + extrasPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedFlavor || !pizzaType) return;

    addItem(pizzaType, selectedFlavor, selectedExtras, observations, quantity);
    navigate("/cart");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (!pizzaType) {
    return null;
  }

  const totalPrice = calculateTotalPrice();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Personalize sua {pizzaType.name}
              </h1>
              <p className="text-gray-600">{pizzaType.description}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Customization Options */}
            <div className="lg:col-span-2 space-y-6">
              {/* Flavor Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Escolha o Sabor</CardTitle>
                  <p className="text-sm text-gray-600">
                    Selecione um sabor para sua pizza
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {flavors.map((flavor) => (
                      <div
                        key={flavor.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedFlavor?.id === flavor.id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedFlavor(flavor)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {flavor.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {flavor.description}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {flavor.price === 0
                              ? "Incluso"
                              : `+${formatPrice(flavor.price)}`}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Extras Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Adicionais (Opcional)</CardTitle>
                  <p className="text-sm text-gray-600">
                    Personalize ainda mais sua pizza
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {extras.map((extra) => (
                      <div
                        key={extra.id}
                        className="flex items-start space-x-3"
                      >
                        <Checkbox
                          id={extra.id}
                          checked={selectedExtras.some(
                            (e) => e.id === extra.id,
                          )}
                          onCheckedChange={(checked) =>
                            handleExtraToggle(extra, checked as boolean)
                          }
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={extra.id}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {extra.name}
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {extra.description}
                          </p>
                        </div>
                        <Badge variant="outline">
                          +{formatPrice(extra.price)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Observations */}
              <Card>
                <CardHeader>
                  <CardTitle>Observações (Opcional)</CardTitle>
                  <p className="text-sm text-gray-600">
                    Alguma preferência especial?
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Ex: sem cebola, molho leve, bem assada..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Pizza Details */}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {pizzaType.name}
                    </h3>
                    {selectedFlavor && (
                      <p className="text-sm text-gray-600">
                        Sabor: {selectedFlavor.name}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Base: {formatPrice(pizzaType.basePrice)}
                      {selectedFlavor &&
                        selectedFlavor.price > 0 &&
                        ` + ${formatPrice(selectedFlavor.price)}`}
                    </p>
                  </div>

                  {/* Selected Extras */}
                  {selectedExtras.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Adicionais:
                      </h4>
                      <div className="space-y-1">
                        {selectedExtras.map((extra) => (
                          <div
                            key={extra.id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">{extra.name}</span>
                            <span className="text-gray-900">
                              +{formatPrice(extra.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Observations */}
                  {observations && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Observações:
                      </h4>
                      <p className="text-sm text-gray-600">{observations}</p>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Quantidade:
                    </h4>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold w-8 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-lg">Total:</span>
                      <span className="font-bold text-xl text-red-600">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>

                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={handleAddToCart}
                      disabled={!selectedFlavor}
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};