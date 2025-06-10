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
    const { isAuthenticated, customerName } = useCustomerAuth();

    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");

    const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({ street: "", number: "", complement: "", neighborhood: "", city: "", zipCode: "" });
    const [payment, setPayment] = useState<Payment>({ method: "cash" });
    const [observations, setObservations] = useState("");

    useEffect(() => {
        if (items.length === 0) {
            navigate("/cart");
        }
    }, [items, navigate]);

    // Abre o modal de login se o usuário não estiver autenticado e tentar acessar o checkout
    useEffect(() => {
        if (!isAuthenticated) {
            setLoginModalOpen(true);
        }
    }, [isAuthenticated]);

    const totalPrice = getTotalPrice();
    const deliveryFee = deliveryType === 'delivery' && totalPrice < 40 ? 5 : 0;
    const finalTotal = totalPrice + deliveryFee;

    const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDeliveryAddress(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentChange = (value: "cash" | "card") => {
        setPayment(prev => ({ ...prev, method: value, cardBrand: undefined, cardType: undefined }));
    };

    const handleSubmitOrder = async () => {
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

                                    <Card>
                                        <CardHeader><CardTitle>1. Opção de Entrega</CardTitle></CardHeader>
                                        <CardContent>
                                            <RadioGroup defaultValue="delivery" value={deliveryType} onValueChange={(value: "delivery" | "pickup") => setDeliveryType(value)}>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="delivery" id="delivery" /><Label htmlFor="delivery" className="flex items-center gap-2"><Truck className="h-5 w-5"/>Receber em casa</Label></div>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="pickup" id="pickup" /><Label htmlFor="pickup" className="flex items-center gap-2"><Store className="h-5 w-5"/>Retirar no local</Label></div>
                                            </RadioGroup>
                                        </CardContent>
                                    </Card>

                                    {deliveryType === "delivery" && (
                                        <Card>
                                            <CardHeader><CardTitle>2. Endereço de Entrega</CardTitle></CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="col-span-2"><Label htmlFor="street">Rua</Label><Input id="street" name="street" value={deliveryAddress.street} onChange={handleInputChange} /></div>
                                                    <div><Label htmlFor="number">Número</Label><Input id="number" name="number" value={deliveryAddress.number} onChange={handleInputChange} /></div>
                                                </div>
                                                <div><Label htmlFor="complement">Complemento (Opcional)</Label><Input id="complement" name="complement" value={deliveryAddress.complement} onChange={handleInputChange} /></div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div><Label htmlFor="neighborhood">Bairro</Label><Input id="neighborhood" name="neighborhood" value={deliveryAddress.neighborhood} onChange={handleInputChange} /></div>
                                                    <div><Label htmlFor="zipCode">CEP</Label><Input id="zipCode" name="zipCode" value={deliveryAddress.zipCode} onChange={handleInputChange} /></div>
                                                </div>
                                                <div><Label htmlFor="city">Cidade</Label><Input id="city" name="city" value={deliveryAddress.city} onChange={handleInputChange} /></div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    <Card>
                                        <CardHeader><CardTitle>3. Pagamento</CardTitle></CardHeader>
                                        <CardContent>
                                            <RadioGroup defaultValue="cash" value={payment.method} onValueChange={handlePaymentChange}>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="cash" id="cash" /><Label htmlFor="cash" className="flex items-center gap-2"><Banknote className="h-5 w-5"/>Dinheiro</Label></div>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="card" id="card" /><Label htmlFor="card" className="flex items-center gap-2"><CreditCard className="h-5 w-5"/>Cartão na entrega</Label></div>
                                            </RadioGroup>
                                            {payment.method === 'card' && (
                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                   <Select onValueChange={val => setPayment(p => ({ ...p, cardBrand: val as any }))}><SelectTrigger><SelectValue placeholder="Bandeira" /></SelectTrigger><SelectContent><SelectItem value="visa">Visa</SelectItem><SelectItem value="mastercard">Mastercard</SelectItem><SelectItem value="elo">Elo</SelectItem></SelectContent></Select>
                                                   <Select onValueChange={val => setPayment(p => ({ ...p, cardType: val as any }))}><SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger><SelectContent><SelectItem value="credit">Crédito</SelectItem><SelectItem value="debit">Débito</SelectItem></SelectContent></Select>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader><CardTitle>4. Observações (Opcional)</CardTitle></CardHeader>
                                        <CardContent>
                                            <Textarea placeholder="Ex: sem cebola, ponto da carne, etc." value={observations} onChange={e => setObservations(e.target.value)} />
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            <Card className="sticky top-8">
                                <CardHeader><CardTitle>Resumo do Pedido</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                                    <div className="flex justify-between"><span>Taxa de entrega</span><span>{deliveryFee > 0 ? formatPrice(deliveryFee) : 'Grátis'}</span></div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total</span><span>{formatPrice(finalTotal)}</span></div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handleSubmitOrder} className="w-full bg-red-600 hover:bg-red-700" disabled={!isAuthenticated || isLoading}>
                                        {isLoading ? "Processando..." : "Finalizar Pedido"}
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