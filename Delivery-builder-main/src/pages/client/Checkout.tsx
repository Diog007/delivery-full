import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CreditCard, Banknote, Truck, Store, UserCheck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { LoginModal } from "@/components/LoginModal";
import { DeliveryAddress, Payment } from "@/types";
import { OrderDtos } from "@/dto";

type CartItemRequestDto = OrderDtos.CartItemRequestDto;
type CreateOrderDto = OrderDtos.CreateOrderDto;

export const Checkout = () => {
    const navigate = useNavigate();
    const { items, getTotalPrice, clearCart } = useCart();
    const { createOrder, isLoading } = useOrders();
    // --- CORREÇÃO ---: Pegamos todos os dados necessários do contexto de autenticação
    const { isAuthenticated, customerName, login, register } = useCustomerAuth();

    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");

    // --- MELHORIA ---: Estado simplificado. Não precisamos mais de um objeto 'customer' aqui.
    const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({ street: "", number: "", complement: "", neighborhood: "", city: "", zipCode: "" });
    const [payment, setPayment] = useState<Payment>({ method: "cash" });
    const [observations, setObservations] = useState("");

    // --- MELHORIA ---: Redireciona se o carrinho estiver vazio
    useEffect(() => {
        if (items.length === 0) {
            navigate("/cart");
        }
    }, [items, navigate]);

    const totalPrice = getTotalPrice();
    const deliveryFee = deliveryType === 'delivery' && totalPrice < 40 ? 5 : 0;
    const finalTotal = totalPrice + deliveryFee;

    const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

    const handleSubmitOrder = async () => {
        // Validação extra, embora o botão não deva aparecer se não autenticado.
        if (!isAuthenticated) {
            alert("Você precisa estar logado para finalizar o pedido.");
            setLoginModalOpen(true);
            return;
        }

        try {
            const itemsForApi: CartItemRequestDto[] = items.map(item => ({
                pizzaTypeId: item.pizzaType.id,
                flavorId: item.flavor.id,
                extraIds: item.extras.map(extra => extra.id),
                observations: item.observations,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
            }));

            const orderData: CreateOrderDto = {
                items: itemsForApi,
                deliveryType,
                deliveryAddress: deliveryType === "delivery" ? deliveryAddress : undefined,
                payment,
                status: "received",
                createdAt: new Date(),
                estimatedDeliveryTime: new Date(Date.now() + (deliveryType === "delivery" ? 45 : 30) * 60 * 1000),
                totalAmount: finalTotal,
                observations,
            };

            const order = await createOrder(orderData);

            if (order) {
                clearCart();
                navigate(`/tracking/${order.id}`);
            } else {
                throw new Error("O pedido não foi criado com sucesso.");
            }
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            alert("Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.");
        }
    };

    return (
        <Layout>
            <LoginModal open={isLoginModalOpen} setOpen={setLoginModalOpen} />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center mb-8">
                        <Button variant="ghost" onClick={() => navigate("/cart")} className="mr-4">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Carrinho
                        </Button>
                        <h1 className="text-3xl font-bold">Finalizar Pedido</h1>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {/* --- LÓGICA DE AUTENTICAÇÃO --- */}
                            {!isAuthenticated ? (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center"><UserCheck className="h-5 w-5 mr-2 text-red-600" /> Identificação</CardTitle>
                                        <p className="text-sm text-gray-600">Para continuar, por favor, entre ou crie sua conta.</p>
                                    </CardHeader>
                                    <CardContent>
                                        <Button onClick={() => setLoginModalOpen(true)} className="w-full bg-red-600 hover:bg-red-700">
                                            Entrar ou Criar Conta
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Olá, {customerName}!</CardTitle>
                                            <p className="text-sm text-gray-600">Seu pedido será associado à sua conta.</p>
                                        </CardHeader>
                                    </Card>

                                    {/* Formulário de Entrega */}
                                    <Card>
                                        <CardHeader><CardTitle>1. Opção de Entrega</CardTitle></CardHeader>
                                        <CardContent>
                                            <RadioGroup defaultValue="delivery" onValueChange={(value: "delivery" | "pickup") => setDeliveryType(value)}>
                                                {/* Opções de Rádio Group */}
                                            </RadioGroup>
                                        </CardContent>
                                    </Card>

                                    {/* Formulário de Endereço (se entrega) */}
                                    {deliveryType === "delivery" && (
                                        <Card>
                                            <CardHeader><CardTitle>2. Endereço de Entrega</CardTitle></CardHeader>
                                            <CardContent>
                                                {/* Campos do Endereço */}
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Formulário de Pagamento */}
                                    <Card>
                                        <CardHeader><CardTitle>3. Pagamento</CardTitle></CardHeader>
                                        <CardContent>
                                            {/* Opções de Pagamento */}
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </div>

                        {/* Resumo do Pedido */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-8">
                                <CardHeader><CardTitle>Resumo do Pedido</CardTitle></CardHeader>
                                <CardContent>
                                    {/* Itens e preços */}
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handleSubmitOrder} className="w-full bg-red-600 hover:bg-red-700" disabled={!isAuthenticated || isLoading}>
                                        {isLoading ? "Processando..." : "Finalizar e Pagar"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};