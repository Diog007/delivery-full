import React, { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from "@/components/AdminLayout";
import { Order, Customer, OrderStatus, OrderItemFromApi } from "@/types";
import { useOrders } from "@/contexts/OrderContext";
import { api } from "@/services/apiService";
import { Search, Phone, Mail, MapPin, CreditCard, Clock, FileText, ShoppingBag, Banknote, Utensils, GlassWater, Pizza, Star, Slice, PlusCircle, MessageSquare } from 'lucide-react';
import { statusConfig, formatCurrency, formatTime, formatDate } from '@/lib/orderUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';


// Componente da Lista de Pedidos (à esquerda)
interface OrderListProps {
  orders: Order[];
  customers: Customer[];
  selectedOrderId: string | null;
  onOrderSelect: (orderId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: OrderStatus | 'all';
  onStatusFilterChange: (status: OrderStatus | 'all') => void;
  isLoading: boolean;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  customers,
  selectedOrderId,
  onOrderSelect,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isLoading
}) => {
    
  const filteredOrders = useMemo(() => orders.filter(order => {
    const customer = customers.find(c => c.id === order.customerUser?.id);
    const matchesSearch =
      order.id.substring(0, 8).toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.whatsapp?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }), [orders, customers, searchTerm, statusFilter]);

  return (
    <div className="w-[37rem] bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">
      <div className="p-6 border-b border-gray-200 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por código, cliente ou tel..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filtrar por status</label>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => onStatusFilterChange('all')}
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              className={`rounded-full px-4 text-xs transition-all duration-200 ${statusFilter === 'all' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-gray-300 text-gray-600'}`}
            >
              Todos
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <Button
                key={status}
                size="sm"
                onClick={() => onStatusFilterChange(status as OrderStatus)}
                variant={statusFilter === status ? 'default' : 'outline'}
                className={`rounded-full px-4 text-xs flex items-center gap-1.5 transition-all duration-200 ${statusFilter === status ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-gray-300 text-gray-600'}`}
              >
                {React.cloneElement(config.icon as React.ReactElement, { className: "w-3 h-3" })}
                <span>{config.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
            <div className="p-4 space-y-3">
                {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-6 text-center text-gray-500 mt-10">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="font-medium">Nenhum pedido encontrado</p>
            <p className="text-sm">Tente ajustar os filtros de busca.</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => onOrderSelect(order.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedOrderId === order.id
                    ? 'border-red-500 bg-red-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">#{order.id.substring(0,8).toUpperCase()}</h3>
                    <p className="text-sm text-gray-600">{order.customerUser.name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                    {React.cloneElement(statusConfig[order.status].icon as React.ReactElement, { className: "w-3 h-3 inline-block mr-1" })}
                    {statusConfig[order.status].label}
                  </span>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="text-sm text-gray-500">
                    <p>{formatTime(order.createdAt)}</p>
                    <p>{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// Componente dos Detalhes do Pedido (à direita)
interface OrderDetailsProps {
  order: Order | null;
  customer: Customer | null | undefined;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, customer, onStatusUpdate }) => {
  if (!order) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
             <Utensils className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Selecione um pedido</h3>
          <p className="text-sm">Escolha um pedido da lista para ver os detalhes completos</p>
        </div>
      </div>
    );
  }

  // Calcula subtotal e taxa de entrega
  const subTotal = order.items.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = order.totalAmount - subTotal;

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pedido #{order.id.substring(0,8).toUpperCase()}</h1>
              <p className="text-gray-600 mt-1">
                Criado em {formatDate(order.createdAt)} às {formatTime(order.createdAt)}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusConfig[order.status].color}`}>
              {statusConfig[order.status].icon} {statusConfig[order.status].label}
            </span>
          </div>
          {order.estimatedDeliveryTime && (
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <Clock className="w-4 h-4 mr-2" />
              <span>Previsão: {formatTime(order.estimatedDeliveryTime)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações do Cliente</h2>
            <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 text-red-700">👤</div>
                  <span className="font-medium text-gray-900">{order.customerUser.name}</span>
                </div>
              {customer?.whatsapp && <div className="flex items-center"><Phone className="w-4 h-4 text-gray-400 mr-3 ml-2" /><span className="text-gray-700">{customer.whatsapp}</span></div>}
              {order.customerUser.email && <div className="flex items-center"><Mail className="w-4 h-4 text-gray-400 mr-3 ml-2" /><span className="text-gray-700">{order.customerUser.email}</span></div>}
            </div>
          </div>

          {order.deliveryType === 'DELIVERY' && order.deliveryAddress && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Endereço de Entrega</h2>
                <div className="flex items-start text-sm"><MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" /><div className="text-gray-700"><p>{order.deliveryAddress.street}, {order.deliveryAddress.number}</p>{order.deliveryAddress.complement && (<p>{order.deliveryAddress.complement}</p>)}<p>{order.deliveryAddress.neighborhood}</p><p>{order.deliveryAddress.city} - {order.deliveryAddress.zipCode}</p></div></div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Itens do Pedido</h2>
          <div className="space-y-4">
            {order.items.map((item: OrderItemFromApi) => {
                // Item do tipo PIZZA
                if (item.itemType === 'PIZZA' && item.pizzaType) {
                    const isHalfAndHalf = item.flavors && item.flavors.length > 1;
                    return (
                        <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="w-24 h-24 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                                {item.pizzaType.imageUrl
                                    ? <img src={`http://localhost:8090${item.pizzaType.imageUrl}`} alt={item.pizzaType.name} className="w-full h-full object-cover rounded-md" />
                                    : <Pizza className="w-12 h-12 text-gray-400" />
                                }
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-800">{item.quantity}x {item.pizzaType.name}</h3>
                                    <p className="font-bold text-lg text-gray-800">{formatCurrency(item.totalPrice)}</p>
                                </div>
                                <p className="text-sm font-medium text-red-700 mb-3">{item.flavors?.map(f => f.name).join(' / ') || 'Sabor não definido'}</p>
                                
                                <div className="text-xs border-t border-dashed border-gray-300 pt-2">
                                    <h4 className="font-semibold text-gray-700 mb-1">Composição do Valor (Unid.):</h4>
                                    <div className="space-y-1 text-gray-500">
                                        <div className="flex justify-between"><span>Pizza Base</span><span>{formatCurrency(item.pizzaType.basePrice)}</span></div>
                                        {item.flavors?.map(flavor => {
                                            const flavorPrice = isHalfAndHalf ? flavor.price / 2 : flavor.price;
                                            return (<div key={flavor.id} className="flex justify-between"><span>Sabor: {flavor.name} {isHalfAndHalf && '(Metade)'}</span><span>+ {formatCurrency(flavorPrice)}</span></div>)
                                        })}
                                        {item.crust && item.crust.price > 0 && (<div className="flex justify-between"><span>Borda: {item.crust.name}</span><span>+ {formatCurrency(item.crust.price)}</span></div>)}
                                        {item.appliedExtras?.map(applied => (<div key={applied.extra.id} className="flex justify-between"><span>Adicional: {applied.extra.name}</span><span>+ {formatCurrency(applied.extra.price)}</span></div>))}
                                        <div className="flex justify-between font-bold text-gray-700 pt-1 border-t border-gray-300"><span className='text-sm'>Subtotal (Unidade)</span><span className='text-sm'>{formatCurrency(item.totalPrice / item.quantity)}</span></div>
                                    </div>
                                </div>
                                
                                {item.observations && (
                                    <div className="flex items-start gap-2 mt-3 pt-2 border-t border-dashed border-gray-300">
                                        <MessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm italic text-gray-600">"{item.observations}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
                // Item do tipo BEBIDA
                if (item.itemType === 'BEVERAGE' && item.beverage) {
                    return (
                        <div key={item.id} className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="w-24 h-24 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center p-2">
                                {item.beverage.imageUrl
                                    ? <img src={`http://localhost:8090${item.beverage.imageUrl}`} alt={item.beverage.name} className="w-full h-full object-contain" />
                                    : <GlassWater className="w-12 h-12 text-gray-400" />
                                }
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-800">{item.quantity}x {item.beverage.name}</h3>
                                    <p className="font-bold text-lg text-gray-800">{formatCurrency(item.totalPrice)}</p>
                                </div>
                                <p className="text-sm text-gray-600">{item.beverage.description}</p>
                                {item.observations && (
                                    <div className="flex items-start gap-2 mt-2 pt-2 border-t border-dashed border-gray-300">
                                        <MessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm italic text-gray-600">"{item.observations}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
                return null;
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pagamento</h2>
            <div className="flex items-center">
                {order.payment.method === 'CASH' ? <Banknote className="w-5 h-5 text-gray-400 mr-3" /> : <CreditCard className="w-5 h-5 text-gray-400 mr-3" />}
                <span className="text-gray-700">{order.payment.method === 'CASH' ? 'Dinheiro' : `Cartão (${order.payment.cardBrand})`}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo Financeiro</h2>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="text-gray-900">{formatCurrency(subTotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Taxa de entrega</span><span className="text-gray-900">{formatCurrency(deliveryFee)}</span></div>
                <div className="border-t pt-2 mt-2"><div className="flex justify-between"><span className="text-lg font-semibold text-gray-900">Total</span><span className="text-lg font-bold text-red-600">{formatCurrency(order.totalAmount)}</span></div></div>
            </div>
          </div>
        </div>

        {order.observations && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Observações do Pedido</h2>
            <div className="flex items-start"><FileText className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" /><p className="text-gray-700">{order.observations}</p></div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
             <h2 className="text-xl font-semibold text-gray-900 mb-4">Atualizar Status</h2>
             <div className="flex space-x-2">
                <Select value={order.status} onValueChange={(value) => onStatusUpdate(order.id, value as OrderStatus)}>
                    <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {Object.entries(statusConfig).map(([status, config]) => (
                            <SelectItem key={status} value={status}>{config.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

      </div>
    </div>
  );
};


// Componente Principal da Página
export const OrderManagement = () => {
    const { orders, refreshOrders, isLoading: isOrdersLoading } = useOrders();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>("all");

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            await refreshOrders();
            const customerData = await api.admin.getAllCustomers();
            setCustomers(Array.isArray(customerData) ? customerData : []);
            setIsLoading(false);
        };
        loadInitialData();
    }, [refreshOrders]);
    
    useEffect(() => {
        const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const filtered = sortedOrders.filter(order => {
             const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
             return matchesStatus;
        });

        if (filtered.length > 0 && !filtered.some(o => o.id === selectedOrderId)) {
           setSelectedOrderId(filtered[0].id);
        } else if (filtered.length === 0) {
            setSelectedOrderId(null);
        }

    }, [orders, statusFilter, selectedOrderId]);

    const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
        await api.admin.updateOrderStatus(orderId, status);
        refreshOrders();
    };

    const selectedOrder = useMemo(() => orders.find(o => o.id === selectedOrderId) || null, [orders, selectedOrderId]);
    const selectedCustomer = useMemo(() => customers.find(c => c.id === selectedOrder?.customerUser?.id), [customers, selectedOrder]);
    
    return (
        <AdminLayout>
            <div className="flex h-[calc(100vh-theme(spacing.24))]">
                <OrderList 
                    orders={orders.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                    customers={customers}
                    selectedOrderId={selectedOrderId}
                    onOrderSelect={setSelectedOrderId}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    isLoading={isLoading || isOrdersLoading}
                />
                <OrderDetails 
                    order={selectedOrder}
                    customer={selectedCustomer}
                    onStatusUpdate={handleStatusUpdate}
                />
            </div>
        </AdminLayout>
    );
};