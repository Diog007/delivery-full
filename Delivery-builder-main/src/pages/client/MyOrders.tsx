import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Order } from "@/types";
import apiService from "@/services/apiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";

export const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await apiService.getCustomerOrders();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const formatPrice = (price) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>
                {isLoading ? <p>Carregando...</p> : (
                    <div className="space-y-6">
                        {orders.length === 0 ? <p>Você ainda não fez nenhum pedido.</p> :
                            orders.map(order => (
                                <Card key={order.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>Pedido #{order.id.substring(0, 8)}</CardTitle>
                                            <OrderStatusBadge status={order.status as any} />
                                        </div>
                                        <p className="text-sm text-gray-500">Feito em: {formatDate(order.createdAt)}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <ul>{order.items.map(item => <li key={item.id}>{item.quantity}x {item.pizzaType.name} - {item.flavor.name}</li>)}</ul>
                                        <p className="text-right font-bold mt-4 text-lg">{formatPrice(order.totalAmount)}</p>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                )}
            </div>
        </Layout>
    );
};