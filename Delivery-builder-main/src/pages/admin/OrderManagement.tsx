import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

import {
  Eye,
  RefreshCw,
  Filter,
  Clock,
  MapPin,
  Mail,
  CreditCard,
  Banknote,
  Users,
  Calendar,
  Truck,
  Search,
  Hash,
  User,
  Phone,
  MessageSquare,
  PlusCircle,
  XCircle
} from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import { Order, OrderStatus, Customer } from "@/types";
import { api } from "@/services/apiService";

export const OrderManagement = () => {
  const { orders, updateOrderStatus, refreshOrders, isLoading: isOrdersLoading } = useOrders();
  
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<string>("all");
  const [orderIdFilter, setOrderIdFilter] = useState<string>("");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  useEffect(() => {
    refreshOrders();
    api.admin.getAllCustomers().then(setCustomers);
  }, [refreshOrders]);
  
  const calculatedFilteredOrders = useMemo(() => {
    let tempOrders = [...orders];

    if (orderIdFilter) {
        tempOrders = tempOrders.filter(order => order.id.toLowerCase().includes(orderIdFilter.toLowerCase()));
    }
    if (statusFilter !== 'all') {
        tempOrders = tempOrders.filter(order => order.status === statusFilter);
    }
    if (customerFilter !== 'all') {
        tempOrders = tempOrders.filter(order => order.customerUser?.id === customerFilter);
    }
    if (deliveryTypeFilter !== 'all') {
        tempOrders = tempOrders.filter(order => order.deliveryType === deliveryTypeFilter);
    }

    if (dateFilter !== 'all') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        if (dateFilter === 'today') {
            tempOrders = tempOrders.filter(o => new Date(o.createdAt) >= today);
        } else if (dateFilter === 'yesterday') {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            tempOrders = tempOrders.filter(o => {
                const orderDate = new Date(o.createdAt);
                return orderDate >= yesterday && orderDate < today;
            });
        } else if (dateFilter === 'last7days') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
            tempOrders = tempOrders.filter(o => new Date(o.createdAt) >= sevenDaysAgo);
        }
    }

    return tempOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, orderIdFilter, statusFilter, customerFilter, deliveryTypeFilter, dateFilter]);

  useEffect(() => {
    setFilteredOrders(calculatedFilteredOrders);
  }, [calculatedFilteredOrders]);

  const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
  const formatDateTime = (date: Date | string) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(date));
  const getTimeAgo = (date: Date | string) => {
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
       setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case "RECEIVED": return "PREPARING";
      case "PREPARING": return "OUT_FOR_DELIVERY";
      case "OUT_FOR_DELIVERY": return "COMPLETED";
      default: return null;
    }
  };

  const getNextStatusLabel = (currentStatus: OrderStatus): string => {
    switch (currentStatus) {
      case "RECEIVED": return "Iniciar Preparo";
      case "PREPARING": return "Marcar como Saiu";
      case "OUT_FOR_DELIVERY": return "Finalizar Pedido";
      default: return "";
    }
  };
  
  const openDetailsModal = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };
  
  const OrderDetailDialog = () => {
    if (!selectedOrder) return null;
    return (
        <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="flex items-center justify-between"><span>Pedido #{selectedOrder.id.substring(0,8)}</span><OrderStatusBadge status={selectedOrder.status} /></DialogTitle></DialogHeader>
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Informações do Pedido</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-600">Data/Hora:</span><span>{formatDateTime(selectedOrder.createdAt)}</span></div><div className="flex justify-between"><span className="text-gray-600">Tempo decorrido:</span><span>{getTimeAgo(selectedOrder.createdAt)}</span></div><div className="flex justify-between"><span className="text-gray-600">Tipo:</span><Badge variant="outline">{selectedOrder.deliveryType === "DELIVERY" ? "Entrega" : "Retirada"}</Badge></div><div className="flex justify-between items-center"><span className="text-gray-600">Total:</span><span className="font-semibold text-lg">{formatPrice(selectedOrder.totalAmount)}</span></div></CardContent></Card>
                        <Card><CardHeader className="pb-3"><CardTitle className="text-sm flex items-center"><Mail className="h-4 w-4 mr-2" />Cliente</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><div><span className="text-gray-600">Nome:</span><p className="font-medium">{selectedOrder.customerUser?.name}</p></div><div><span className="text-gray-600">E-mail:</span><p>{selectedOrder.customerUser?.email}</p></div></CardContent></Card>
                    </div>
                    {selectedOrder.deliveryType === "DELIVERY" && selectedOrder.deliveryAddress && (<Card><CardHeader className="pb-3"><CardTitle className="text-sm flex items-center"><MapPin className="h-4 w-4 mr-2" />Endereço de Entrega</CardTitle></CardHeader><CardContent className="text-sm"><p>{selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.number}{selectedOrder.deliveryAddress.complement && `, ${selectedOrder.deliveryAddress.complement}`}</p><p>{selectedOrder.deliveryAddress.neighborhood} - {selectedOrder.deliveryAddress.city}</p><p>CEP: {selectedOrder.deliveryAddress.zipCode}</p></CardContent></Card>)}
                    <Card><CardHeader className="pb-3"><CardTitle className="text-sm flex items-center">{selectedOrder.payment.method === "CASH" ? <Banknote className="h-4 w-4 mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}Pagamento</CardTitle></CardHeader><CardContent className="text-sm">{selectedOrder.payment.method === "CASH" ? <p>Dinheiro</p> : <div className="space-y-1"><p>Cartão {selectedOrder.payment.cardBrand?.toUpperCase()}</p><p className="capitalize">{selectedOrder.payment.cardType}</p></div>}</CardContent></Card>
                    <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Itens do Pedido</CardTitle></CardHeader><CardContent><div className="space-y-4">{selectedOrder.items.map((item, index) => (<div key={index} className="border-b pb-3 last:border-b-0"><div className="flex justify-between items-start mb-2"><div className="flex-1"><h4 className="font-medium">{item.quantity}x {item.pizzaType?.name || 'Tipo Removido'} - {item.flavors?.map(f => f.name).join(' / ') || 'Sabor Removido'}</h4><p className="text-sm text-gray-600 mt-1">{item.flavors?.map(f => f.description).join(' / ')}</p></div><span className="font-semibold">{formatPrice(item.totalPrice)}</span></div>{item.extras?.length > 0 && (<div className="ml-4"><p className="text-sm text-gray-600 mb-1">Adicionais:</p><div className="flex flex-wrap gap-1">{item.extras.map((extra) => (<Badge key={extra.id} variant="outline" className="text-xs">{extra.name} (+{formatPrice(extra.price)})</Badge>))}</div></div>)}{item.observations && (<div className="ml-4 mt-2"><p className="text-sm text-gray-600"><strong>Obs:</strong> {item.observations}</p></div>)}</div>))}</div></CardContent></Card>
                    <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Atualizar Status</CardTitle></CardHeader><CardContent><div className="flex space-x-2"><Select value={selectedOrder.status} onValueChange={(value) => handleStatusUpdate(selectedOrder.id, value as OrderStatus)}><SelectTrigger className="flex-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="RECEIVED">Pedido Recebido</SelectItem><SelectItem value="PREPARING">Em Preparo</SelectItem><SelectItem value="OUT_FOR_DELIVERY">{selectedOrder.deliveryType === "DELIVERY" ? "Saiu para Entrega" : "Pronto para Retirada"}</SelectItem><SelectItem value="COMPLETED">Finalizado</SelectItem><SelectItem value="CANCELLED">Cancelado</SelectItem></SelectContent></Select>{getNextStatus(selectedOrder.status) && (<Button onClick={() => { const nextStatus = getNextStatus(selectedOrder.status); if (nextStatus) handleStatusUpdate(selectedOrder.id, nextStatus); }} className="bg-green-600 hover:bg-green-700">{getNextStatusLabel(selectedOrder.status)}</Button>)}</div></CardContent></Card>
                </div>
            </DialogContent>
        </Dialog>
    );
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div><h1 className="text-3xl font-bold text-gray-900">Gerenciar Pedidos</h1><p className="text-gray-600">Visualize e atualize o status dos pedidos</p></div>
          <Button onClick={refreshOrders} variant="outline" disabled={isOrdersLoading}><RefreshCw className={`h-4 w-4 mr-2 ${isOrdersLoading ? 'animate-spin' : ''}`} />Atualizar</Button>
        </div>
        <Card>
          <CardHeader><CardTitle className="flex items-center text-lg"><Filter className="h-5 w-5 mr-2" />Filtros</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
              <div>
                <Label htmlFor="orderIdFilter">Código do Pedido</Label>
                <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input id="orderIdFilter" placeholder="Buscar código..." className="pl-8" value={orderIdFilter} onChange={e => setOrderIdFilter(e.target.value)} /></div>
              </div>
              <div><Label>Status</Label><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos os Status</SelectItem><SelectItem value="RECEIVED">Recebido</SelectItem><SelectItem value="PREPARING">Em Preparo</SelectItem><SelectItem value="OUT_FOR_DELIVERY">Em Rota/Retirada</SelectItem><SelectItem value="COMPLETED">Finalizado</SelectItem><SelectItem value="CANCELLED">Cancelado</SelectItem></SelectContent></Select></div>
              <div><Label>Cliente</Label><Select value={customerFilter} onValueChange={setCustomerFilter}><SelectTrigger><div className="flex items-center gap-2"><Users className="h-4 w-4" /><SelectValue /></div></SelectTrigger><SelectContent><SelectItem value="all">Todos os Clientes</SelectItem>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Data</Label><Select value={dateFilter} onValueChange={setDateFilter}><SelectTrigger><div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><SelectValue /></div></SelectTrigger><SelectContent><SelectItem value="all">Qualquer Data</SelectItem><SelectItem value="today">Hoje</SelectItem><SelectItem value="yesterday">Ontem</SelectItem><SelectItem value="last7days">Últimos 7 dias</SelectItem></SelectContent></Select></div>
              <div><Label>Tipo de Entrega</Label><Select value={deliveryTypeFilter} onValueChange={setDeliveryTypeFilter}><SelectTrigger><div className="flex items-center gap-2"><Truck className="h-4 w-4" /><SelectValue /></div></SelectTrigger><SelectContent><SelectItem value="all">Todos os Tipos</SelectItem><SelectItem value="DELIVERY">Entrega</SelectItem><SelectItem value="PICKUP">Retirada</SelectItem></SelectContent></Select></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pedidos</CardTitle><CardDescription>{filteredOrders.length} pedido(s) encontrado(s).</CardDescription></CardHeader>
          <CardContent>
            {isOrdersLoading ? (<div className="text-center py-12 text-gray-500">Carregando pedidos...</div>) :
            filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500"><Clock className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Nenhum pedido encontrado com os filtros selecionados</p></div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const customer = customers.find(c => c.id === order.customerUser?.id);
                  return (
                    <Card key={order.id} className="p-4">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex-1 min-w-[250px]">
                           <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
                                <button onClick={() => openDetailsModal(order)} className="flex items-center gap-1 font-semibold text-lg text-red-600 hover:underline"><Hash className="h-4 w-4" /><span>Pedido #{order.id.substring(0,8)}</span></button>
                                <OrderStatusBadge status={order.status} />
                                <Badge variant="outline" className="whitespace-nowrap">{order.deliveryType === "DELIVERY" ? "Entrega" : "Retirada"}</Badge>
                           </div>
                           <Separator />
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-sm">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-800">Cliente</h4>
                                    <p className="flex items-center gap-2 text-gray-600"><User className="h-4 w-4 text-gray-400" /> {order.customerUser?.name}</p>
                                    {customer?.whatsapp && <p className="flex items-center gap-2 text-gray-600"><Phone className="h-4 w-4 text-gray-400" /> {customer.whatsapp}</p>}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-800">Entrega & Pagamento</h4>
                                    {order.deliveryType === 'DELIVERY' && order.deliveryAddress && (<p className="flex items-start gap-2 text-gray-600"><MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" /><span>{order.deliveryAddress.neighborhood}, {order.deliveryAddress.city}</span></p>)}
                                    <p className="flex items-center gap-2 text-gray-600">{order.payment.method === 'CASH' ? <Banknote className="h-4 w-4 text-gray-400" /> : <CreditCard className="h-4 w-4 text-gray-400" />} {order.payment.method === 'CASH' ? 'Dinheiro' : `Cartão (${order.payment.cardBrand})`}</p>
                                    <p className="flex items-center gap-2 text-gray-600" title={formatDateTime(order.createdAt)}><Clock className="h-4 w-4 text-gray-400" /> {getTimeAgo(order.createdAt)}</p>
                                </div>
                           </div>
                        </div>
                        <Separator orientation="vertical" className="hidden md:block h-auto" />
                        <div className="w-full md:w-auto md:max-w-xs lg:max-w-sm flex-shrink-0">
                            <h4 className="font-semibold text-gray-800 mb-2">Itens do Pedido</h4>
                            <div className="space-y-2 text-sm">
                                {order.items.map((item, index) => (
                                    <div key={index}>
                                        {/* --- LINHA CORRIGIDA --- */}
                                        <p className="text-gray-800 font-medium">{item.quantity}x {item.pizzaType?.name || 'Tipo Removido'} - {item.flavors?.map(f => f.name).join(' / ') || 'Sabor Removido'}</p>
                                        {item.extras && item.extras.length > 0 && <p className="text-gray-500 text-xs flex items-center gap-1.5 ml-1 mt-1"><PlusCircle className="h-3 w-3" /> {item.extras.map(e => e.name).join(', ')}</p>}
                                        {item.observations && <p className="text-gray-500 text-xs flex items-center gap-1.5 ml-1 mt-1"><MessageSquare className="h-3 w-3" /> {item.observations}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                         <p className="font-bold text-xl">{formatPrice(order.totalAmount)}</p>
                         <div className="flex items-center gap-2">
                            {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                                            <XCircle className="h-4 w-4 mr-1" />Cancelar
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle><AlertDialogDescription>Tem certeza que deseja cancelar o pedido #{order.id.substring(0,8)}? Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter><AlertDialogCancel>Voltar</AlertDialogCancel><AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleStatusUpdate(order.id, "CANCELLED")}>Sim, cancelar pedido</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                            {getNextStatus(order.status) && (<Button size="sm" onClick={() => { const nextStatus = getNextStatus(order.status); if (nextStatus) handleStatusUpdate(order.id, nextStatus); }} className="bg-green-600 hover:bg-green-700">{getNextStatusLabel(order.status)}</Button>)}
                            <Button variant="outline" size="sm" onClick={() => openDetailsModal(order)}><Eye className="h-4 w-4 mr-1" />Ver Detalhes</Button>
                         </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        <OrderDetailDialog />
      </div>
    </AdminLayout>
  );
};