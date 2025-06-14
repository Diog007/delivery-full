import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { CartItem } from "@/components/CartItem";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ShoppingCart, Trash2, Tag, CreditCard, Banknote } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

export const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    updateItemQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();
  
  const [coupon, setCoupon] = useState("");

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const deliveryFee = totalPrice < 40 && totalPrice > 0 ? 5 : 0;
  const finalTotal = totalPrice + deliveryFee;

  const handleApplyCoupon = () => {
    alert(`Cupom "${coupon}" aplicado! (Funcionalidade de exemplo)`);
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-8">
                        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar ao Cardápio
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="py-12">
                            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Seu carrinho está vazio</h2>
                            <p className="text-gray-600 mb-6">Que tal adicionar algumas de nossas pizzas deliciosas?</p>
                            <Button onClick={() => navigate("/")} className="bg-red-600 hover:bg-red-700">Ver Cardápio</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center"><h1 className="text-3xl font-bold text-gray-900">Seu Carrinho</h1></div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}><ArrowLeft className="h-4 w-4 mr-2" />Continuar Comprando</Button>
              <Button variant="ghost" onClick={clearCart} className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4 mr-2" />Limpar Carrinho</Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} onUpdateQuantity={updateItemQuantity} onRemove={removeItem} />
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-md">
                <CardHeader><CardTitle>Resumo do Pedido</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coupon" className="flex items-center text-sm font-medium"><Tag className="h-4 w-4 mr-2"/> Cupom de Desconto</Label>
                    <div className="flex space-x-2">
                        <Input id="coupon" placeholder="Insira seu cupom" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                        <Button variant="outline" onClick={handleApplyCoupon} disabled={!coupon}>Aplicar</Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({totalItems} {totalItems === 1 ? "item" : "itens"})</span>
                      <span className="font-medium">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxa de entrega</span>
                      {deliveryFee > 0 ? (<span className="font-medium">{formatPrice(deliveryFee)}</span>) : (<span className="font-semibold text-green-600">Grátis</span>)}
                    </div>
                  </div>
                  {totalPrice < 40 && totalPrice > 0 && (
                    <div className="text-center text-xs text-yellow-800 bg-yellow-100 p-2 rounded-md border border-yellow-200">
                      Faltam {formatPrice(40 - totalPrice)} para <strong>entrega grátis</strong>!
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-baseline font-bold text-xl">
                    <span>Total</span>
                    <span className="text-red-600">{formatPrice(finalTotal)}</span>
                  </div>
                </CardContent>

                <CardFooter className="flex-col gap-4">
                  <Button size="lg" className="w-full bg-red-600 hover:bg-red-700" onClick={handleProceedToCheckout}>
                    Ir para o Checkout
                  </Button>
                  
                  <TooltipProvider>
                    <div className="flex items-center justify-center space-x-4 text-gray-500 pt-2">
                        <Tooltip>
                            <TooltipTrigger><CreditCard className="h-6 w-6" /></TooltipTrigger>
                            <TooltipContent><p>Cartão de Crédito/Débito</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger><Banknote className="h-6 w-6" /></TooltipTrigger>
                            <TooltipContent><p>Dinheiro</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger><span className="font-bold text-lg">PIX</span></TooltipTrigger>
                            <TooltipContent><p>Pagamento via PIX</p></TooltipContent>
                        </Tooltip>
                    </div>
                  </TooltipProvider>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};