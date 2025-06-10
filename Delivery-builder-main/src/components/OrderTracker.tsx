import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Truck, Package } from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderTrackerProps {
  order: Order;
}

interface StatusStep {
  status: OrderStatus;
  label: string;
  description: string;
  icon: typeof CheckCircle;
}

export const OrderTracker = ({ order }: OrderTrackerProps) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  const statusSteps: StatusStep[] = [
    {
      status: "received",
      label: "Pedido Recebido",
      description: "Seu pedido foi confirmado e está na fila de preparo",
      icon: CheckCircle,
    },
    {
      status: "preparing",
      label: "Em Preparo",
      description: "Nossos chefs estão preparando sua pizza com carinho",
      icon: Package,
    },
    {
      status: "out_for_delivery",
      label:
        order.deliveryType === "delivery"
          ? "Saiu para Entrega"
          : "Pronto para Retirada",
      description:
        order.deliveryType === "delivery"
          ? "Sua pizza está a caminho!"
          : "Sua pizza está pronta para retirada no balcão",
      icon: order.deliveryType === "delivery" ? Truck : Package,
    },
    {
      status: "completed",
      label: "Finalizado",
      description:
        order.deliveryType === "delivery"
          ? "Pizza entregue com sucesso!"
          : "Pizza retirada com sucesso!",
      icon: CheckCircle,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - order.createdAt.getTime()) / 1000 / 60,
      );
      setTimeElapsed(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [order.createdAt]);

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex((step) => step.status === order.status);
  };

  const getProgress = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / statusSteps.length) * 100;
  };

  const getEstimatedTime = () => {
    if (!order.estimatedDeliveryTime) return null;

    const now = new Date();
    const estimated = new Date(order.estimatedDeliveryTime);
    const diffMs = estimated.getTime() - now.getTime();
    const diffMins = Math.ceil(diffMs / 1000 / 60);

    if (diffMins <= 0) return "A qualquer momento";
    if (diffMins === 1) return "1 minuto";
    return `${diffMins} minutos`;
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const currentStepIndex = getCurrentStepIndex();
  const estimatedTime = getEstimatedTime();

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Pedido #{order.id}</CardTitle>
            <OrderStatusBadge status={order.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Tempo decorrido:</p>
              <p className="font-semibold">{formatTime(timeElapsed)}</p>
            </div>
            {estimatedTime && order.status !== "completed" && (
              <div>
                <p className="text-sm text-gray-600">
                  Tempo estimado restante:
                </p>
                <p className="font-semibold text-green-600">{estimatedTime}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Acompanhamento do Pedido</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <Progress value={getProgress()} className="h-2" />
              <p className="text-sm text-gray-600 mt-2">
                {Math.round(getProgress())}% concluído
              </p>
            </div>

            {/* Status Steps */}
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div
                    key={step.status}
                    className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                      isCurrent
                        ? "bg-blue-50 border border-blue-200"
                        : isCompleted
                          ? "bg-green-50"
                          : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 ${
                        isCompleted ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-medium ${
                          isCurrent
                            ? "text-blue-900"
                            : isCompleted
                              ? "text-green-900"
                              : "text-gray-600"
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p
                        className={`text-sm ${
                          isCurrent
                            ? "text-blue-700"
                            : isCompleted
                              ? "text-green-700"
                              : "text-gray-500"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                    {isCurrent && (
                      <div className="flex-shrink-0">
                        <div className="animate-pulse w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium">
                    {item.quantity}x {item.pizzaType.name} - {item.flavor.name}
                  </p>
                  {item.extras.length > 0 && (
                    <p className="text-sm text-gray-600">
                      + {item.extras.map((e) => e.name).join(", ")}
                    </p>
                  )}
                  {item.observations && (
                    <p className="text-sm text-gray-600">
                      Obs: {item.observations}
                    </p>
                  )}
                </div>
                <span className="font-semibold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(item.totalPrice)}
                </span>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t font-semibold text-lg">
              <span>Total:</span>
              <span>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(order.totalAmount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
