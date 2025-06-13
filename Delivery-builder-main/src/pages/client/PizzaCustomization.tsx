import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Plus, Minus, Pizza } from "lucide-react";
import { PizzaType, PizzaFlavor, PizzaExtra, PizzaCrust } from "@/types";
import { api } from "@/services/apiService";
import { useCart } from "@/contexts/CartContext";

export const PizzaCustomization = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const pizzaType = location.state?.pizzaType as PizzaType;

  const [flavors, setFlavors] = useState<PizzaFlavor[]>([]);
  const [extras, setExtras] = useState<PizzaExtra[]>([]);
  const [crusts, setCrusts] = useState<PizzaCrust[]>([]); // Estado para bordas
  
  const [selectedFlavor, setSelectedFlavor] = useState<PizzaFlavor | null>(null);
  const [selectedCrust, setSelectedCrust] = useState<PizzaCrust | null>(null); // Estado para borda selecionada
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
        const [allFlavors, extrasForType, crustsForType] = await Promise.all([
            api.public.getPizzaFlavors(),
            api.public.getExtrasForType(pizzaType.id),
            api.public.getCrustsForType(pizzaType.id) // Busca as bordas
        ]);
        
        const flavorsForType = Array.isArray(allFlavors) 
          ? allFlavors.filter(flavor => flavor.pizzaType?.id === pizzaType.id) 
          : [];

        setFlavors(flavorsForType);
        setExtras(Array.isArray(extrasForType) ? extrasForType : []);
        setCrusts(Array.isArray(crustsForType) ? crustsForType : []);

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
    const crustPrice = selectedCrust ? selectedCrust.price : 0;
    const extrasPrice = selectedExtras.reduce(
      (sum, extra) => sum + extra.price,
      0,
    );

    return (basePrice + flavorPrice + crustPrice + extrasPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedFlavor || !pizzaType) return;
    addItem(pizzaType, selectedFlavor, selectedCrust, selectedExtras, observations, quantity);
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
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => navigate("/")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Personalize sua {pizzaType.name}</h1>
              <p className="text-gray-600">{pizzaType.description}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Escolha o Sabor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {flavors.map((flavor) => (
                      <div
                        key={flavor.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-start gap-4 ${
                          selectedFlavor?.id === flavor.id ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedFlavor(flavor)}
                      >
                         {flavor.imageUrl ? (
                            <img src={`http://localhost:8090${flavor.imageUrl}`} alt={flavor.name} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
                        ) : (
                            <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                                <Pizza className="h-8 w-8" />
                            </div>
                        )}
                        <div className="flex-1 flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{flavor.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{flavor.description}</p>
                          </div>
                          <Badge variant="secondary" className="flex-shrink-0 ml-2">
                            {flavor.price === 0 ? "Incluso" : `+${formatPrice(flavor.price)}`}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* --- NOVA SEÇÃO DE BORDAS --- */}
              <Card>
                <CardHeader>
                  <CardTitle>2. Escolha a Borda (Opcional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedCrust?.id || 'none'} onValueChange={(value) => {
                      if (value === 'none') {
                          setSelectedCrust(null);
                      } else {
                          const crust = crusts.find(c => c.id === value);
                          setSelectedCrust(crust || null);
                      }
                  }}>
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="crust-none" />
                          <Label htmlFor="crust-none">Borda Tradicional (Sem custo)</Label>
                      </div>
                      {crusts.map((crust) => (
                          <div key={crust.id} className="flex items-center space-x-2">
                              <RadioGroupItem value={crust.id} id={`crust-${crust.id}`} />
                              <Label htmlFor={`crust-${crust.id}`} className="flex-1">{crust.name}</Label>
                              <Badge variant="outline">+{formatPrice(crust.price)}</Badge>
                          </div>
                      ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Adicionais (Opcional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {extras.map((extra) => (
                      <div key={extra.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={extra.id}
                          checked={selectedExtras.some((e) => e.id === extra.id)}
                          onCheckedChange={(checked) => handleExtraToggle(extra, checked as boolean)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={extra.id} className="text-sm font-medium cursor-pointer">{extra.name}</Label>
                          <p className="text-sm text-gray-600 mt-1">{extra.description}</p>
                        </div>
                        <Badge variant="outline">+{formatPrice(extra.price)}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>4. Observações (Opcional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea placeholder="Ex: sem cebola, molho leve, bem assada..." value={observations} onChange={(e) => setObservations(e.target.value)} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{pizzaType.name}</h3>
                    {selectedFlavor && (<p className="text-sm text-gray-600">Sabor: {selectedFlavor.name}</p>)}
                  </div>
                  
                  {selectedCrust && (
                      <div>
                          <h4 className="font-medium text-gray-900">Borda:</h4>
                          <div className="flex justify-between text-sm"><span className="text-gray-600">{selectedCrust.name}</span><span className="text-gray-900">+{formatPrice(selectedCrust.price)}</span></div>
                      </div>
                  )}

                  {selectedExtras.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Adicionais:</h4>
                      <div className="space-y-1">
                        {selectedExtras.map((extra) => (
                          <div key={extra.id} className="flex justify-between text-sm"><span className="text-gray-600">{extra.name}</span><span className="text-gray-900">+{formatPrice(extra.price)}</span></div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Quantidade:</h4>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Minus className="h-4 w-4" /></Button>
                      <span className="font-semibold w-8 text-center">{quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-lg">Total:</span>
                      <span className="font-bold text-xl text-red-600">{formatPrice(totalPrice)}</span>
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleAddToCart} disabled={!selectedFlavor}>Adicionar ao Carrinho</Button>
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
