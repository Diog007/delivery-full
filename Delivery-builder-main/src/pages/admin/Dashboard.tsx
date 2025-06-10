import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  TrendingUp,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useOrders } from "@/contexts/OrderContext";
import { Order } from "@/types";

export const AdminDashboard = () => {
  const { dashboardStats, refreshDashboard } = useAdmin();
  const { orders, refreshOrders } = useOrders();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    refreshDashboard();
    refreshOrders();
  }, [refreshDashboard, refreshOrders]);

  useEffect(() => {
    const recent = [...orders] // Cria uma cópia para não mutar o estado original
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);
    setRecentOrders(recent);
  }, [orders]);

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

  const pendingOrders = orders.filter((order) =>
    ["received", "preparing", "out_for_delivery"].includes(order.status),
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral da operação</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              refreshDashboard();
              refreshOrders();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        {dashboardStats && (
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.todayOrders}</div>
                <p className="text-xs text-muted-foreground">+2 desde ontem</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(dashboardStats.revenue.today)}</div>
                <p className="text-xs text-muted-foreground">+8% desde ontem</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders.length}</div>
                <p className="text-xs text-muted-foreground">Requerem atenção</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(dashboardStats.revenue.month)}</div>
                <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Pendentes</CardTitle>
              <p className="text-sm text-gray-600">Pedidos que precisam de atenção imediata</p>
            </CardHeader>
            <CardContent>
              {pendingOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500"><Clock className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Nenhum pedido pendente no momento</p></div>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1"><span className="font-medium">Pedido #{order.id}</span><OrderStatusBadge status={order.status} /></div>
                        {/* --- CORREÇÃO APLICADA --- */}
                        <p className="text-sm text-gray-600">{order.customerUser?.name} - {getTimeAgo(new Date(order.createdAt))}</p>
                        <p className="text-sm font-medium">{formatPrice(order.totalAmount)}</p>
                      </div>
                      <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                    </div>
                  ))}

                  {pendingOrders.length > 5 && (
                    <div className="text-center pt-2"><Button variant="ghost" size="sm">Ver todos os {pendingOrders.length} pedidos pendentes</Button></div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recentes</CardTitle>
              <p className="text-sm text-gray-600">Últimos pedidos recebidos</p>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500"><ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Nenhum pedido recente</p></div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1"><span className="font-medium">Pedido #{order.id}</span><OrderStatusBadge status={order.status} /></div>
                         {/* --- CORREÇÃO APLICADA --- */}
                        <p className="text-sm text-gray-600">{order.customerUser?.name}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(new Date(order.createdAt))}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                        <Badge variant="outline" className="text-xs">{order.deliveryType === "delivery" ? "Entrega" : "Retirada"}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};