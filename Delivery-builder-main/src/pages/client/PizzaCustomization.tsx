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
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowLeft, Plus, Minus, Pizza, CheckCircle } from "lucide-react";
import { PizzaType, PizzaFlavor, PizzaExtra, PizzaCrust, AppliedExtra } from "@/types";
import { api } from "@/services/apiService";
import { useCart } from "@/contexts/CartContext";

type ExtraSelection = {
  extraId: string;
  placement: 'whole' | string;
};

export const PizzaCustomization = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const pizzaType = location.state?.pizzaType as PizzaType;

  const [flavors, setFlavors] = useState<PizzaFlavor[]>([]);
  const [extras, setExtras] = useState<PizzaExtra[]>([]);
  const [crusts, setCrusts] = useState<PizzaCrust[]>([]);
  
  const [isHalfAndHalf, setIsHalfAndHalf] = useState(false);
  const [selectedFlavors, setSelectedFlavors] = useState<PizzaFlavor[]>([]);
  const [selectedCrust, setSelectedCrust] = useState<PizzaCrust | null>(null);
  const [extraSelections, setExtraSelections] = useState<ExtraSelection[]>([]);
  const [activePlacement, setActivePlacement] = useState<'whole' | string>('whole');
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
          api.public.getCrustsForType(pizzaType.id),
        ]);
        const flavorsForType = Array.isArray(allFlavors) ? allFlavors.filter(flavor => flavor.pizzaTypes.some(pt => pt.id === pizzaType.id)) : [];
        setFlavors(flavorsForType);
        setExtras(Array.isArray(extrasForType) ? extrasForType : []);
        setCrusts(Array.isArray(crustsForType) ? crustsForType : []);
        if (flavorsForType.length > 0) {
          setSelectedFlavors([flavorsForType[0]]);
        }
      } catch (error) {
        console.error("Failed to fetch customization data:", error);
      }
    };
    fetchData();
  }, [pizzaType, navigate]);

  const handleFlavorSelection = (flavor: PizzaFlavor) => {
    if (isHalfAndHalf) {
      const isSelected = selectedFlavors.some(f => f.id === flavor.id);
      if (isSelected) {
        const newSelectedFlavors = selectedFlavors.filter(f => f.id !== flavor.id);
        setSelectedFlavors(newSelectedFlavors);
        setExtraSelections(prev => prev.filter(sel => sel.placement !== flavor.id));
        if (activePlacement === flavor.id) {
          setActivePlacement('whole');
        }
      } else if (selectedFlavors.length < 2) {
        setSelectedFlavors(prev => [...prev, flavor].sort((a,b) => a.name.localeCompare(b.name)));
      }
    } else {
      setSelectedFlavors([flavor]);
    }
  };

  const handleExtraToggle = (extraId: string) => {
    setExtraSelections(prevSelections => {
        let newSelections = [...prevSelections];
        const isCurrentlySelected = newSelections.some(
            sel => sel.extraId === extraId && sel.placement === activePlacement
        );

        if (isCurrentlySelected) {
            return newSelections.filter(
                sel => !(sel.extraId === extraId && sel.placement === activePlacement)
            );
        }
        
        if (activePlacement === 'whole') {
            newSelections = newSelections.filter(sel => sel.extraId !== extraId);
        } else {
            newSelections = newSelections.filter(sel => !(sel.extraId === extraId && sel.placement === 'whole'));
        }
        
        newSelections.push({ extraId: extraId, placement: activePlacement });
        
        return newSelections;
    });
  };

  const calculateTotalPrice = () => {
    if (!pizzaType || selectedFlavors.length === 0) return 0;
    const highestFlavorPrice = Math.max(0, ...selectedFlavors.map(f => f.price));
    const extrasPrice = extraSelections.reduce((sum, selection) => {
      const extra = extras.find(e => e.id === selection.extraId);
      return sum + (extra?.price || 0);
    }, 0);
    const crustPrice = selectedCrust?.price || 0;
    return (pizzaType.basePrice + highestFlavorPrice + extrasPrice + crustPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (selectedFlavors.length === 0 || !pizzaType) return;
    const appliedExtras: AppliedExtra[] = extraSelections.map(selection => {
      const extra = extras.find(e => e.id === selection.extraId)!;
      const onFlavor = selection.placement === 'whole' ? null : flavors.find(f => f.id === selection.placement) || null;
      return { extra, onFlavor };
    });
    addItem(pizzaType, selectedFlavors, selectedCrust, appliedExtras, observations, quantity);
    navigate("/cart");
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
  const totalPrice = calculateTotalPrice();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8"><Button variant="ghost" onClick={() => navigate("/")} className="mr-4"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button><div><h1 className="text-3xl font-bold text-gray-900">Personalize sua {pizzaType?.name}</h1><p className="text-gray-600">{pizzaType?.description}</p></div></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><div className="flex justify-between items-center"><CardTitle>1. Escolha o(s) Sabor(es)</CardTitle><div className="flex items-center space-x-2"><Label htmlFor="half-half-switch">Dois Sabores</Label><Switch id="half-half-switch" checked={isHalfAndHalf} onCheckedChange={(checked) => {setIsHalfAndHalf(checked); setSelectedFlavors([]); setExtraSelections([]);}} /></div></div><p className="text-sm text-muted-foreground pt-1">{isHalfAndHalf ? "Selecione até dois sabores. O valor será cobrado pelo sabor de maior preço." : "Selecione um sabor."}</p></CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {flavors.map((flavor) => {
                      const isSelected = selectedFlavors.some(f => f.id === flavor.id);
                      return (<div key={flavor.id} className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-start gap-4 ${isSelected ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"}`} onClick={() => handleFlavorSelection(flavor)}>{isHalfAndHalf && <Checkbox checked={isSelected} className="mt-1" />} {flavor.imageUrl ? <img src={`http://localhost:8090${flavor.imageUrl}`} alt={flavor.name} className="w-20 h-20 rounded-md object-cover flex-shrink-0" /> : <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0"><Pizza className="h-8 w-8" /></div>} <div className="flex-1 flex justify-between items-start"><div><h3 className="font-semibold text-gray-900">{flavor.name}</h3><p className="text-sm text-gray-600 mt-1">{flavor.description}</p></div><Badge variant="secondary" className="flex-shrink-0 ml-2">{flavor.price === 0 ? "Incluso" : `+${formatPrice(flavor.price)}`}</Badge></div></div>);
                    })}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader><CardTitle>2. Adicionais (Opcional)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {isHalfAndHalf && selectedFlavors.length === 2 && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Label className="font-semibold">Escolha onde adicionar:</Label>
                      <ToggleGroup type="single" value={activePlacement} onValueChange={(value) => value && setActivePlacement(value)} className="grid grid-cols-3 gap-2 mt-2">
                        <ToggleGroupItem value={selectedFlavors[0].id} aria-label={`Metade ${selectedFlavors[0].name}`}>Metade {selectedFlavors[0].name}</ToggleGroupItem>
                        <ToggleGroupItem value="whole" aria-label="Pizza Toda">Pizza Toda</ToggleGroupItem>
                        <ToggleGroupItem value={selectedFlavors[1].id} aria-label={`Metade ${selectedFlavors[1].name}`}>Metade {selectedFlavors[1].name}</ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  )}
                  {extras.map((extra) => {
                    const isChecked = extraSelections.some(sel => sel.extraId === extra.id && sel.placement === activePlacement);
                    const placements = extraSelections.filter(sel => sel.extraId === extra.id);
                    return (
                      <div key={extra.id} className="p-3 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <Checkbox id={extra.id} checked={isChecked} onCheckedChange={() => handleExtraToggle(extra.id)} className="mt-1"/>
                          <div className="flex-1">
                            <Label htmlFor={extra.id} className="font-medium cursor-pointer">{extra.name} <Badge variant="outline" className="ml-2">+{formatPrice(extra.price)}</Badge></Label>
                            <p className="text-sm text-muted-foreground">{extra.description}</p>
                            {placements.length > 0 && (
                               <div className="flex flex-wrap gap-1 mt-2">
                                {placements.map(p => {
                                    const flavor = flavors.find(f => f.id === p.placement);
                                    return <Badge key={p.placement} variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1"/>{flavor ? `Metade ${flavor.name}` : 'Pizza Toda'}</Badge>
                                })}
                               </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card><CardHeader><CardTitle>3. Escolha a Borda (Opcional)</CardTitle></CardHeader><CardContent><RadioGroup value={selectedCrust?.id || 'none'} onValueChange={(value) => setSelectedCrust(value === 'none' ? null : crusts.find(c => c.id === value) || null)}><div className="flex items-center space-x-2"><RadioGroupItem value="none" id="crust-none" /><Label htmlFor="crust-none">Borda Tradicional (Sem custo)</Label></div>{crusts.map((crust) => (<div key={crust.id} className="flex items-center space-x-2"><RadioGroupItem value={crust.id} id={`crust-${crust.id}`} /><Label htmlFor={`crust-${crust.id}`} className="flex-1">{crust.name}</Label><Badge variant="outline">+{formatPrice(crust.price)}</Badge></div>))}</RadioGroup></CardContent></Card>
              <Card><CardHeader><CardTitle>4. Observações (Opcional)</CardTitle></CardHeader><CardContent><Textarea placeholder="Ex: sem cebola, bem assada..." value={observations} onChange={(e) => setObservations(e.target.value)} /></CardContent></Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader><CardTitle>Resumo do Pedido</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><h3 className="font-semibold text-gray-900">{pizzaType?.name}</h3>{selectedFlavors.length > 0 && (<p className="text-sm text-gray-600">Sabor: {selectedFlavors.map(f => f.name).join(' / ')}</p>)}</div>
                  {selectedCrust && (<div><h4 className="font-medium text-gray-900">Borda:</h4><div className="flex justify-between text-sm"><span className="text-gray-600">{selectedCrust.name}</span><span className="text-gray-900">+{formatPrice(selectedCrust.price)}</span></div></div>)}
                  
                  {extraSelections.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Adicionais:</h4>
                      <div className="space-y-1">
                        {extraSelections.map((sel) => {
                          const extra = extras.find(e => e.id === sel.extraId);
                          const flavor = selectedFlavors.find(f => f.id === sel.placement);
                          const placementText = flavor ? `(Metade ${flavor.name})` : '(Pizza Toda)';
                          return (
                            <div key={`${sel.extraId}-${sel.placement}`} className="flex justify-between text-sm">
                              <span className="text-gray-600 truncate pr-2">{extra?.name} <span className="text-gray-500">{placementText}</span></span>
                              <span className="text-gray-900">+{formatPrice(extra?.price || 0)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div><h4 className="font-medium text-gray-900 mb-2">Quantidade:</h4><div className="flex items-center space-x-3"><Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Minus className="h-4 w-4" /></Button><span className="font-semibold w-8 text-center">{quantity}</span><Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button></div></div>
                  <div className="border-t pt-4"><div className="flex justify-between items-center mb-4"><span className="font-semibold text-lg">Total:</span><span className="font-bold text-xl text-red-600">{formatPrice(totalPrice)}</span></div><Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleAddToCart} disabled={!pizzaType || selectedFlavors.length === 0}>Adicionar ao Carrinho</Button></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};