import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { CartItem } from "@/components/CartItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

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

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
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
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Cardápio
              </Button>
            </div>

            <Card>
              <CardContent className="py-12">
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Seu carrinho está vazio
                </h2>
                <p className="text-gray-600 mb-6">
                  Adicione algumas pizzas deliciosas ao seu carrinho!
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Ver Cardápio
                </Button>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuar Comprando
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Carrinho de Compras
                </h1>
                <p className="text-gray-600">
                  {totalItems} {totalItems === 1 ? "item" : "itens"} no carrinho
                </p>
              </div>
            </div>

            {items.length > 0 && (
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Limpar Carrinho
              </Button>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateItemQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Subtotal ({totalItems}{" "}
                        {totalItems === 1 ? "item" : "itens"}):
                      </span>
                      <span className="font-medium">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxa de entrega:</span>
                      <span className="font-medium">
                        {totalPrice >= 40 ? (
                          <span className="text-green-600">Grátis</span>
                        ) : (
                          formatPrice(5)
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {totalPrice < 40 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Faltam {formatPrice(40 - totalPrice)}</strong>{" "}
                        para entrega grátis!
                      </p>
                    </div>
                  )}

                  {totalPrice >= 40 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        🎉 <strong>Parabéns!</strong> Você ganhou entrega
                        grátis!
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-lg">Total:</span>
                      <span className="font-bold text-xl text-red-600">
                        {formatPrice(totalPrice + (totalPrice >= 40 ? 0 : 5))}
                      </span>
                    </div>

                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={handleProceedToCheckout}
                    >
                      Finalizar Pedido
                    </Button>
                  </div>

                  {/* Security Info */}
                  <div className="text-center text-xs text-gray-500 mt-4">
                    <p>🔒 Compra 100% segura</p>
                    <p>Seus dados estão protegidos</p>
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
