import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import {
  ShoppingBag,
  DollarSign,
  Clock,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  ClipboardList,
  UtensilsCrossed
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useOrders } from "@/contexts/OrderContext";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { dashboardStats, weeklySales, salesByType, refreshDashboard, isLoading: isAdminLoading } = useAdmin();
  const { orders, refreshOrders, isLoading: isOrdersLoading } = useOrders();

  useEffect(() => {
    refreshDashboard();
    refreshOrders();
  }, []);

  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  const formatDateShort = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const PIE_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const isLoading = isAdminLoading || isOrdersLoading;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral da operação em tempo real</p>
          </div>
          <Button
            variant="outline"
            onClick={() => { refreshDashboard(); refreshOrders(); }}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">{formatPrice(dashboardStats?.revenue.today ?? 0)}</div>}
              <p className="text-xs text-muted-foreground">Receita total do dia</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{dashboardStats?.todayOrders ?? 0}</div>}
              <p className="text-xs text-muted-foreground">Total de vendas do dia</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{dashboardStats?.pendingOrders ?? 0}</div>}
              <p className="text-xs text-muted-foreground">Pedidos que requerem atenção</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">{formatPrice(dashboardStats?.revenue.month ?? 0)}</div>}
              <p className="text-xs text-muted-foreground">Faturamento do mês atual</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Receita nos Últimos 7 Dias</CardTitle>
              <CardDescription>Acompanhe a evolução do faturamento diário.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-[300px] w-full" /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklySales} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="date" tickFormatter={formatDateShort} fontSize={12} />
                    <YAxis tickFormatter={(value) => formatPrice(value as number)} fontSize={12} />
                    <Tooltip cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }} labelStyle={{ fontWeight: 'bold' }} formatter={(value: number) => [formatPrice(value), 'Receita']}/>
                    <Bar dataKey="revenue" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Tipo de Pizza</CardTitle>
              <CardDescription>Tipos de pizza mais populares.</CardDescription>
            </CardHeader>
            <CardContent>
             {isLoading ? <Skeleton className="h-[300px] w-full" /> : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={salesByType} dataKey="count" nameKey="pizzaTypeName" cx="50%" cy="50%" outerRadius={80} label>
                            {salesByType.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]}/>
                        <Legend iconSize={10} />
                    </PieChart>
                </ResponsiveContainer>
             )}
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Orders and Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Pedidos Recentes</CardTitle>
                    <CardDescription>Os últimos 5 pedidos recebidos.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full"/>)}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentOrders.length > 0 ? recentOrders.map(order => (
                                <div key={order.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                                    <div>
                                        <p className="font-medium">{order.customerUser.name}</p>
                                        <p className="text-sm text-gray-500">Pedido #{order.id.substring(0, 8)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                                        <OrderStatusBadge status={order.status} />
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/orders`)}>
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )) : <p className="text-sm text-center text-gray-500 py-4">Nenhum pedido recente.</p>}
                        </div>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                    <CardDescription>Atalhos para as principais áreas.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-3">
                     <Button onClick={() => navigate('/admin/orders')} className="w-full justify-start" variant="outline">
                        <ClipboardList className="mr-2 h-4 w-4"/>
                        Ver Todos os Pedidos
                    </Button>
                    <Button onClick={() => navigate('/admin/menu')} className="w-full justify-start" variant="outline">
                        <UtensilsCrossed className="mr-2 h-4 w-4"/>
                        Gerenciar Cardápio
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </AdminLayout>
  );
};