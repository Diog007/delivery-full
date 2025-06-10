import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Eye,
  RefreshCw,
  Filter,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  Banknote,
} from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import { Order, OrderStatus } from "@/types";

export const OrderManagement = () => {
  const { orders, updateOrderStatus, refreshOrders } = useOrders();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== "all") {
      filtered = orders.filter((order) => order.status === statusFilter);
    }

    // Sort by creation date (newest first)
    filtered = filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    setFilteredOrders(filtered);
  }, [orders, statusFilter]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 1000 / 60);

    if (diffMins < 1) return "Agora mesmo";
    if (diffMins < 60) return `${diffMins} min atrás`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} dia${diffDays > 1 ? "s" : ""} atrás`;
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      const updatedOrder = orders.find((o) => o.id === orderId);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case "received":
        return "preparing";
      case "preparing":
        return "out_for_delivery";
      case "out_for_delivery":
        return "completed";
      default:
        return null;
    }
  };

  const getNextStatusLabel = (currentStatus: OrderStatus): string => {
    switch (currentStatus) {
      case "received":
        return "Iniciar Preparo";
      case "preparing":
        return "Marcar como Saiu";
      case "out_for_delivery":
        return "Finalizar Pedido";
      default:
        return "";
    }
  };

  const OrderDetailDialog = () => {
    if (!selectedOrder) return null;

    return (
      <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Pedido #{selectedOrder.id}</span>
              <OrderStatusBadge status={selectedOrder.status} />
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    Informações do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data/Hora:</span>
                    <span>{formatDateTime(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tempo decorrido:</span>
                    <span>{getTimeAgo(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <Badge variant="outline">
                      {selectedOrder.deliveryType === "delivery"
                        ? "Entrega"
                        : "Retirada"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold text-lg">
                      {formatPrice(selectedOrder.totalAmount)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Nome:</span>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">WhatsApp:</span>
                    <p>{selectedOrder.customer.whatsapp}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">E-mail:</span>
                    <p>{selectedOrder.customer.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">CPF:</span>
                    <p>{selectedOrder.customer.cpf}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Delivery Address */}
            {selectedOrder.deliveryType === "delivery" &&
              selectedOrder.deliveryAddress && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Endereço de Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>
                      {selectedOrder.deliveryAddress.street},{" "}
                      {selectedOrder.deliveryAddress.number}
                      {selectedOrder.deliveryAddress.complement &&
                        `, ${selectedOrder.deliveryAddress.complement}`}
                    </p>
                    <p>
                      {selectedOrder.deliveryAddress.neighborhood} -{" "}
                      {selectedOrder.deliveryAddress.city}
                    </p>
                    <p>CEP: {selectedOrder.deliveryAddress.zipCode}</p>
                  </CardContent>
                </Card>
              )}

            {/* Payment Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  {selectedOrder.payment.method === "cash" ? (
                    <Banknote className="h-4 w-4 mr-2" />
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {selectedOrder.payment.method === "cash" ? (
                  <p>Dinheiro</p>
                ) : (
                  <div className="space-y-1">
                    <p>
                      Cartão {selectedOrder.payment.cardBrand?.toUpperCase()}
                    </p>
                    <p className="capitalize">
                      {selectedOrder.payment.cardType}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {item.quantity}x {item.pizzaType.name} -{" "}
                            {item.flavor.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.flavor.description}
                          </p>
                        </div>
                        <span className="font-semibold">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </div>

                      {item.extras.length > 0 && (
                        <div className="ml-4">
                          <p className="text-sm text-gray-600 mb-1">
                            Adicionais:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {item.extras.map((extra) => (
                              <Badge
                                key={extra.id}
                                variant="outline"
                                className="text-xs"
                              >
                                {extra.name} (+{formatPrice(extra.price)})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.observations && (
                        <div className="ml-4 mt-2">
                          <p className="text-sm text-gray-600">
                            <strong>Obs:</strong> {item.observations}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Update */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Atualizar Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) =>
                      handleStatusUpdate(selectedOrder.id, value as OrderStatus)
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received">Pedido Recebido</SelectItem>
                      <SelectItem value="preparing">Em Preparo</SelectItem>
                      <SelectItem value="out_for_delivery">
                        {selectedOrder.deliveryType === "delivery"
                          ? "Saiu para Entrega"
                          : "Pronto para Retirada"}
                      </SelectItem>
                      <SelectItem value="completed">Finalizado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>

                  {getNextStatus(selectedOrder.status) && (
                    <Button
                      onClick={() => {
                        const nextStatus = getNextStatus(selectedOrder.status);
                        if (nextStatus) {
                          handleStatusUpdate(selectedOrder.id, nextStatus);
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {getNextStatusLabel(selectedOrder.status)}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gerenciar Pedidos
            </h1>
            <p className="text-gray-600">
              Visualize e atualize o status dos pedidos
            </p>
          </div>
          <Button onClick={refreshOrders} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Status:
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="received">Pedido Recebido</SelectItem>
                    <SelectItem value="preparing">Em Preparo</SelectItem>
                    <SelectItem value="out_for_delivery">
                      Saiu para Entrega
                    </SelectItem>
                    <SelectItem value="completed">Finalizado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredOrders.length}</span>{" "}
                pedido{filteredOrders.length !== 1 ? "s" : ""} encontrado
                {filteredOrders.length !== 1 ? "s" : ""}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum pedido encontrado com os filtros selecionados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          Pedido #{order.id}
                        </h3>
                        <OrderStatusBadge status={order.status} />
                        <Badge variant="outline">
                          {order.deliveryType === "delivery"
                            ? "Entrega"
                            : "Retirada"}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>Cliente:</strong> {order.customer.name}
                        </div>
                        <div>
                          <strong>Total:</strong>{" "}
                          {formatPrice(order.totalAmount)}
                        </div>
                        <div>
                          <strong>Criado:</strong> {getTimeAgo(order.createdAt)}
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Itens:</strong>{" "}
                        {order.items
                          .map(
                            (item) =>
                              `${item.quantity}x ${item.pizzaType.name}`,
                          )
                          .join(", ")}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {getNextStatus(order.status) && (
                        <Button
                          size="sm"
                          onClick={() => {
                            const nextStatus = getNextStatus(order.status);
                            if (nextStatus) {
                              handleStatusUpdate(order.id, nextStatus);
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {getNextStatusLabel(order.status)}
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsOrderDetailOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        <OrderDetailDialog />
      </div>
    </AdminLayout>
  );
};
