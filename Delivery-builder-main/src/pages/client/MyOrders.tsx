import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Order } from "@/types";
import { api } from "@/services/apiService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Pizza, Truck, History, GlassWater } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const data = await api.customer.getCustomerOrders();
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const OrderSkeleton = () => (
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader><div className="flex justify-between items-center"><Skeleton className="h-6 w-48" /><Skeleton className="h-6 w-24" /></div><Skeleton className="h-4 w-40 mt-1" /></CardHeader>
                    <CardContent><div className="space-y-4"><div className="flex items-center space-x-4"><Skeleton className="h-16 w-16 rounded-md" /><div className="space-y-2 flex-1"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div></div></div></CardContent>
                    <CardFooter className="flex justify-between items-center"><Skeleton className="h-8 w-32" /><Skeleton className="h-10 w-44" /></CardFooter>
                </Card>
            ))}
        </div>
    );

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center mb-8"><History className="h-8 w-8 mr-3 text-red-600"/><h1 className="text-3xl font-bold text-gray-800">Meus Pedidos</h1></div>
                {isLoading ? <OrderSkeleton /> : (
                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <Card className="text-center py-12"><CardContent><p className="text-gray-500">Você ainda não fez nenhum pedido.</p><Button onClick={() => navigate('/')} className="mt-4 bg-red-600 hover:bg-red-700">Ver Cardápio</Button></CardContent></Card>
                        ) :
                            orders.map(order => (
                                <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardHeader className="bg-gray-50 border-b"><div className="flex justify-between items-center"><div><CardTitle className="text-lg text-gray-800">Pedido #{order.id.substring(0, 8).toUpperCase()}</CardTitle><p className="text-sm text-gray-500 mt-1">Realizado em: {formatDate(order.createdAt)}</p></div><OrderStatusBadge status={order.status} /></div></CardHeader>
                                    <CardContent className="pt-6">
                                        <h4 className="font-semibold mb-3 text-gray-700">Itens do Pedido:</h4>
                                        <div className="space-y-4">
                                            {order.items.map((item, index) => {
                                                const isPizza = item.itemType === 'PIZZA';
                                                const imageUrl = isPizza ? item.pizzaType?.imageUrl : item.beverage?.imageUrl;
                                                const ItemIcon = isPizza ? Pizza : GlassWater;
                                                const name = isPizza ? `${item.pizzaType?.name}` : item.beverage?.name;
                                                const description = isPizza ? item.flavors?.map(f => f.name).join(' / ') : item.beverage?.description;

                                                return (
                                                <div key={index} className="flex items-center space-x-4">
                                                    {imageUrl ? (
                                                        <img src={`http://localhost:8090${imageUrl}`} alt={name} className="w-16 h-16 rounded-md object-cover"/>
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                                                            <ItemIcon className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-800">{item.quantity}x {name || 'Item Removido'}</p>
                                                        <p className="text-sm text-gray-600">{description || 'Descrição indisponível'}</p>
                                                    </div>
                                                </div>
                                            )})}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-gray-50 border-t flex justify-between items-center py-4">
                                        <div className="text-lg"><span className="text-gray-600">Total: </span><span className="font-bold text-gray-800">{formatPrice(order.totalAmount)}</span></div>
                                        <Button onClick={() => navigate(`/tracking/${order.id}`)} className="bg-red-600 hover:bg-red-700"><Truck className="h-4 w-4 mr-2" />Acompanhar Pedido</Button>
                                    </CardFooter>
                                </Card>
                            ))
                        }
                    </div>
                )}
            </div>
        </Layout>
    );
};