import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, Clock, Truck, Package, XCircle, Home, Wallet, Pizza, Star, Slice, PlusCircle, MessageSquare 
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatPrice } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface OrderTrackerProps {
  order: Order | null | undefined;
}

interface StatusStep {
  status: OrderStatus;
  label: string;
  description: string;
  icon: React.ElementType;
}

export const OrderTracker = ({ order }: OrderTrackerProps) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  if (!order) {
    return null; 
  }

  const statusSteps: StatusStep[] = [
    { status: "RECEIVED", label: "Pedido Recebido", description: "Seu pedido foi confirmado e está na fila de preparo.", icon: CheckCircle },
    { status: "PREPARING", label: "Em Preparo", description: "Nossos chefs estão preparando sua pizza com carinho.", icon: Package },
    { status: "OUT_FOR_DELIVERY", label: order.deliveryType === "DELIVERY" ? "Saiu para Entrega" : "Pronto para Retirada", description: order.deliveryType === "DELIVERY" ? "Sua pizza está a caminho!" : "Sua pizza está pronta para retirada no balcão.", icon: order.deliveryType === "DELIVERY" ? Truck : Package },
    { status: "COMPLETED", label: "Finalizado", description: order.deliveryType === "DELIVERY" ? "Pizza entregue com sucesso!" : "Pizza retirada com sucesso!", icon: CheckCircle },
  ];

  const cancelledStep: StatusStep = {
      status: "CANCELLED",
      label: "Pedido Cancelado",
      description: "Este pedido foi cancelado.",
      icon: XCircle,
  };

  useEffect(() => {
    if (!order.createdAt) return;
    const interval = setInterval(() => {
      const createdAtDate = new Date(order.createdAt);
      const elapsed = Math.floor((Date.now() - createdAtDate.getTime()) / 1000 / 60);
      setTimeElapsed(elapsed > 0 ? elapsed : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const getCurrentStepIndex = () => {
    if (order.status === 'CANCELLED') return -1;
    return statusSteps.findIndex((step) => step.status === order.status);
  };

  const getProgress = () => {
    const currentIndex = getCurrentStepIndex();
    if (order.status === 'COMPLETED') return 100;
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / statusSteps.length) * 100;
  };

  const getEstimatedTime = () => {
    if (!order.estimatedDeliveryTime) return null;
    const now = new Date();
    const estimated = new Date(order.estimatedDeliveryTime);
    const diffMs = estimated.getTime() - now.getTime();
    if (diffMs <= 0) return "A qualquer momento";
    const diffMins = Math.ceil(diffMs / 1000 / 60);
    if (diffMins === 1) return "em 1 minuto";
    return `em ${diffMins} minutos`;
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) return "Menos de 1 min";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const currentStepIndex = getCurrentStepIndex();
  const estimatedTime = getEstimatedTime();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><div className="flex justify-between items-center"><CardTitle>Pedido #{order.id.substring(0, 8)}</CardTitle><OrderStatusBadge status={order.status} /></div></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-600">Tempo decorrido:</p><p className="font-semibold">{formatTime(timeElapsed)}</p></div>
            {estimatedTime && order.status !== "COMPLETED" && order.status !== "CANCELLED" && (<div><p className="text-sm text-gray-600">Previsão de finalização:</p><p className="font-semibold text-green-600">{estimatedTime}</p></div>)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center space-x-2"><Clock className="h-5 w-5" /><span>Acompanhamento do Pedido</span></CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-6">
            {order.status !== 'CANCELLED' && (
                <>
                    <div><Progress value={getProgress()} className="h-2" /><p className="text-sm text-gray-600 mt-2">{Math.round(getProgress())}% concluído</p></div>
                    <div className="space-y-4">
                    {statusSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        return (
                        <div key={step.status} className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${ isCurrent ? "bg-blue-50 border border-blue-200" : isCompleted ? "bg-green-50" : "bg-gray-50"}`}>
                            <div className={`flex-shrink-0 ${isCompleted ? "text-green-600" : "text-gray-400"}`}><Icon className="h-6 w-6" /></div>
                            <div className="flex-1">
                                <h4 className={`font-medium ${isCurrent ? "text-blue-900" : isCompleted ? "text-green-900" : "text-gray-600"}`}>{step.label}</h4>
                                <p className={`text-sm ${isCurrent ? "text-blue-700" : isCompleted ? "text-green-700" : "text-gray-500"}`}>{step.description}</p>
                            </div>
                            {isCurrent && (<div className="flex-shrink-0"><div className="animate-pulse w-3 h-3 bg-blue-500 rounded-full"></div></div>)}
                        </div>
                        );
                    })}
                    </div>
                </>
            )}
            {order.status === 'CANCELLED' && (<div className="flex items-center space-x-3 p-3 rounded-lg bg-red-50 text-red-800"><XCircle className="h-6 w-6" /><div className="flex-1"><h4 className="font-medium">{cancelledStep.label}</h4><p>{cancelledStep.description}</p></div></div>)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Detalhes da Entrega e Pagamento</CardTitle></CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold flex items-center mb-2"><Home className="h-5 w-5 mr-2 text-red-600"/>Entrega</h4>
                    <p className="text-gray-700">{order.deliveryType === 'DELIVERY' ? 'Entrega em Domicílio' : 'Retirada no Local'}</p>
                    {order.deliveryType === 'DELIVERY' && order.deliveryAddress && (
                        <div className="text-sm text-gray-600 mt-1">
                            <p>{order.deliveryAddress.street}, {order.deliveryAddress.number}</p>
                            <p>{order.deliveryAddress.neighborhood}, {order.deliveryAddress.city}</p>
                            <p>CEP: {order.deliveryAddress.zipCode}</p>
                        </div>
                    )}
                </div>
                <div>
                    <h4 className="font-semibold flex items-center mb-2"><Wallet className="h-5 w-5 mr-2 text-red-600"/>Pagamento</h4>
                    <p className="text-gray-700">{order.payment.method === 'CASH' ? 'Dinheiro' : `Cartão`}</p>
                    {order.payment.method === 'CARD' && (
                        <p className="text-sm text-gray-600 mt-1 capitalize">{order.payment.cardBrand} - {order.payment.cardType}</p>
                    )}
                </div>
            </div>
        </CardContent>
      </Card>

      {/* --- CARD DE RESUMO DA COMPRA ATUALIZADO --- */}
      <Card>
        <CardHeader><CardTitle>Resumo da Compra</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => {
                 const unitPrice = item.totalPrice / item.quantity;
                 const isHalfAndHalf = item.flavors && item.flavors.length > 1;

                return (
                    <div key={item.id} className="py-4 border-b last:border-b-0">
                        <div className="flex items-start space-x-4">
                            {item.pizzaType?.imageUrl ? (
                                <img src={`http://localhost:8090${item.pizzaType.imageUrl}`} alt={item.pizzaType.name} className="w-24 h-24 rounded-lg object-cover"/>
                            ) : (
                                <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0"><Pizza className="h-10 w-10" /></div>
                            )}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-lg text-gray-800">{item.quantity}x {item.pizzaType?.name || 'Item'}</h4>
                                    <span className="font-bold text-lg text-gray-900">{formatPrice(item.totalPrice)}</span>
                                </div>
                                <p className="text-sm font-medium text-red-600 mb-3">{item.flavors?.map(f => f.name).join(' / ') || 'Sabor não encontrado'}</p>

                                <div className="text-sm text-gray-600 space-y-1 border-l-2 border-red-200 pl-3">
                                    <div className="flex justify-between">
                                        <span><Pizza className="h-4 w-4 mr-2 inline-block text-gray-400"/>Valor Base</span>
                                        <span>{formatPrice(item.pizzaType?.basePrice || 0)}</span>
                                    </div>
                                    {item.flavors?.map(flavor => (
                                        <div key={flavor.id} className="flex justify-between">
                                            <span><Star className="h-4 w-4 mr-2 inline-block text-gray-400"/>Sabor: {flavor.name} {isHalfAndHalf && "(Metade)"}</span>
                                            <span>+ {formatPrice(isHalfAndHalf ? flavor.price / 2 : flavor.price)}</span>
                                        </div>
                                    ))}
                                    {item.crust && item.crust.price > 0 && (
                                        <div className="flex justify-between">
                                            <span><Slice className="h-4 w-4 mr-2 inline-block text-gray-400"/>Borda: {item.crust.name}</span>
                                            <span>+ {formatPrice(item.crust.price)}</span>
                                        </div>
                                    )}
                                    {item.appliedExtras?.map(applied => (
                                        <div key={applied.extra.id} className="flex justify-between">
                                            <span className="pl-6">{applied.extra.name} {applied.onFlavor && `(Metade)`}</span>
                                            <span>+ {formatPrice(applied.extra.price)}</span>
                                        </div>
                                    ))}
                                </div>
                                <Separator className="my-2"/>
                                <div className="flex justify-end font-semibold text-gray-800">
                                    <span>Valor Unitário: {formatPrice(unitPrice)}</span>
                                </div>

                                {item.observations && <p className="text-sm mt-3 text-gray-800"><MessageSquare className="h-4 w-4 mr-2 inline-block text-gray-400"/><strong>Observações:</strong> {item.observations}</p>}
                            </div>
                        </div>
                    </div>
                );
            })}
            <div className="flex justify-between items-center pt-4 border-t font-semibold text-xl">
              <span>Total do Pedido:</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};