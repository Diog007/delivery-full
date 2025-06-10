import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { OrderTracker } from "@/components/OrderTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import { Order } from "@/types";

export const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  const [searchOrderId, setSearchOrderId] = useState(orderId || "");
  const [order, setOrder] = useState<Order | undefined | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        const foundOrder = await getOrderById(orderId);
        setOrder(foundOrder);
      } else {
        setOrder(null);
      }
    };
    fetchOrder();
  }, [orderId, getOrderById]);

  // Optional: Add periodic refresh for real-time updates
  useEffect(() => {
    if (orderId) {
      const interval = setInterval(async () => {
        const updatedOrder = await getOrderById(orderId);
        setOrder(updatedOrder);
      }, 15000); // Update every 15 seconds
      return () => clearInterval(interval);
    }
  }, [orderId, getOrderById]);

  const handleSearchOrder = () => {
    if (searchOrderId.trim()) {
      navigate(`/tracking/${searchOrderId.trim()}`);
    }
  };

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
                Acompanhar Pedido
              </h1>
              <p className="text-gray-600">
                Veja o status do seu pedido em tempo real
              </p>
            </div>
          </div>

          {/* Search Order */}
          {!orderId && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Buscar Pedido</CardTitle>
                <p className="text-sm text-gray-600">
                  Digite o número do seu pedido para acompanhar o status
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="orderSearch">Número do Pedido</Label>
                    <Input
                      id="orderSearch"
                      placeholder="Ex: 123456"
                      value={searchOrderId}
                      onChange={(e) => setSearchOrderId(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSearchOrder()
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleSearchOrder}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Tracking */}
          {order ? (
            <OrderTracker order={order} />
          ) : orderId ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Pedido não encontrado
                </h2>
                <p className="text-gray-600 mb-6">
                  Não conseguimos encontrar um pedido com o número #{orderId}.
                  Verifique se o número está correto.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/tracking")}
                  className="mr-4"
                >
                  Tentar Novamente
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Fazer Novo Pedido
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Acompanhe seu Pedido
                </h2>
                <p className="text-gray-600 mb-6">
                  Digite o número do seu pedido acima para acompanhar o status
                  em tempo real. Você recebeu o número do pedido após a
                  confirmação.
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Fazer Novo Pedido
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Precisa de Ajuda?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Status dos Pedidos</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • <strong>Pedido Recebido:</strong> Confirmamos seu pedido
                    </li>
                    <li>
                      • <strong>Em Preparo:</strong> Estamos preparando sua
                      pizza
                    </li>
                    <li>
                      • <strong>Saiu para Entrega:</strong> A caminho do destino
                    </li>
                    <li>
                      • <strong>Finalizado:</strong> Pedido entregue/retirado
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Contato</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Dúvidas sobre seu pedido? Entre em contato:
                  </p>
                  <p className="text-sm">
                    📱 WhatsApp: (11) 99999-9999
                    <br />
                    📞 Telefone: (11) 3333-3333
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};