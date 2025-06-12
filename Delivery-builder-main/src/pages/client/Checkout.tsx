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
import { ArrowLeft, UserCheck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { LoginModal } from "@/components/LoginModal";
import { DeliveryAddress, DeliveryType, Payment, PaymentMethod } from "@/types";
import { OrderDtos } from "@/dto";
import { api } from "@/services/apiService";

type CreateOrderDto = OrderDtos.CreateOrderDto;

export const Checkout = () => {
    const navigate = useNavigate();
    const { items, getTotalPrice, clearCart } = useCart();
    const { isAuthenticated, customerName } = useCustomerAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    
    // Estados do Formulário
    const [deliveryType, setDeliveryType] = useState<DeliveryType>("DELIVERY");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");
    const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({ street: "", number: "", complement: "", neighborhood: "", city: "", zipCode: "" });
    const [observations, setObservations] = useState("");

    const [cardType, setCardType] = useState<"credit" | "debit">("credit");
    const [cardBrand, setCardBrand] = useState<string>("visa");
    
    const [payment, setPayment] = useState<Payment>({ method: "CARD", cardType: "credit", cardBrand: "visa"});

    useEffect(() => {
        if (paymentMethod === 'CARD') {
            setPayment({ method: 'CARD', cardType, cardBrand });
        } else {
            setPayment({ method: 'CASH' });
        }
    }, [paymentMethod, cardType, cardBrand]);


    useEffect(() => {
        if (!isAuthenticated && items.length > 0) {
            setLoginModalOpen(true);
        }
        if (items.length === 0) {
            navigate("/cart");
        }
    }, [items, isAuthenticated, navigate]);

    const totalPrice = getTotalPrice();
    const deliveryFee = deliveryType === 'DELIVERY' && totalPrice < 40 ? 5 : 0;
    const finalTotal = totalPrice + deliveryFee;

    const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setDeliveryAddress(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmitOrder = async () => {
        if (!isAuthenticated) {
            setLoginModalOpen(true);
            return;
        }

        setIsLoading(true);
        try {
            const itemsForApi: OrderDtos.CartItemRequestDto[] = items.map(item => ({
                pizzaTypeId: item.pizzaType.id,
                flavorId: item.flavor.id,
                extraIds: item.extras.map(extra => extra.id),
                observations: item.observations,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
            }));
            
            // --- ALTERAÇÃO PRINCIPAL AQUI ---
            // Objeto de dados do pedido sem os campos 'createdAt' e 'estimatedDeliveryTime'.
            // O backend agora é responsável por definir esses valores.
            const orderData: CreateOrderDto = {
                items: itemsForApi,
                deliveryType,
                deliveryAddress: deliveryType === "DELIVERY" ? deliveryAddress : undefined,
                payment: payment,
                status: "RECEIVED",
                totalAmount: finalTotal,
                observations,
            };

            const createdOrder = await api.customer.createOrder(orderData);
            if (createdOrder) {
                clearCart();
                navigate(`/tracking/${createdOrder.id}`);
            }
        } catch (error) {
            alert(`Erro ao finalizar o pedido: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <LoginModal open={isLoginModalOpen} setOpen={setLoginModalOpen} />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center mb-8">
                    <Button variant="ghost" onClick={() => navigate("/cart")} className="mr-4"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
                    <h1 className="text-3xl font-bold">Finalizar Pedido</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {isAuthenticated ? (
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center"><UserCheck className="h-5 w-5 mr-2 text-green-600" /> Olá, {customerName}!</CardTitle>
                                    <p className="text-sm text-gray-600">Confira os detalhes abaixo para finalizar seu pedido.</p>
                                </CardHeader>
                            </Card>
                        ) : (
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
                        )}
                       
                        {isAuthenticated && (
                            <>
                                <Card>
                                    <CardHeader><CardTitle>1. Opção de Entrega</CardTitle></CardHeader>
                                    <CardContent>
                                        <RadioGroup value={deliveryType} onValueChange={(v: DeliveryType) => setDeliveryType(v)}>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="DELIVERY" id="delivery" /><Label htmlFor="delivery">Entrega em domicílio</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="PICKUP" id="pickup" /><Label htmlFor="pickup">Retirar no local</Label></div>
                                        </RadioGroup>
                                    </CardContent>
                                </Card>

                                {deliveryType === "DELIVERY" && (
                                    <Card>
                                        <CardHeader><CardTitle>2. Endereço de Entrega</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                             <div className="grid grid-cols-2 gap-4">
                                                <div><Label htmlFor="street">Rua</Label><Input id="street" value={deliveryAddress.street} onChange={handleAddressChange} required/></div>
                                                <div><Label htmlFor="number">Número</Label><Input id="number" value={deliveryAddress.number} onChange={handleAddressChange} required/></div>
                                            </div>
                                            <div><Label htmlFor="neighborhood">Bairro</Label><Input id="neighborhood" value={deliveryAddress.neighborhood} onChange={handleAddressChange} required/></div>
                                            <div><Label htmlFor="city">Cidade</Label><Input id="city" value={deliveryAddress.city} onChange={handleAddressChange} required/></div>
                                            <div><Label htmlFor="zipCode">CEP</Label><Input id="zipCode" value={deliveryAddress.zipCode} onChange={handleAddressChange} required/></div>
                                            <div><Label htmlFor="complement">Complemento</Label><Input id="complement" value={deliveryAddress.complement || ''} onChange={handleAddressChange}/></div>
                                        </CardContent>
                                    </Card>
                                )}

                                <Card>
                                    <CardHeader><CardTitle>3. Pagamento</CardTitle></CardHeader>
                                    <CardContent>
                                        <RadioGroup value={paymentMethod} onValueChange={(v: PaymentMethod) => setPaymentMethod(v)}>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="CARD" id="card" /><Label htmlFor="card">Cartão de Crédito/Débito</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="CASH" id="cash" /><Label htmlFor="cash">Dinheiro</Label></div>
                                        </RadioGroup>

                                        {paymentMethod === 'CARD' && (
                                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                                                <div>
                                                    <Label>Tipo do Cartão</Label>
                                                    <Select value={cardType} onValueChange={(v: 'credit' | 'debit') => setCardType(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="credit">Crédito</SelectItem>
                                                            <SelectItem value="debit">Débito</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Bandeira</Label>
                                                    <Select value={cardBrand} onValueChange={setCardBrand}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="visa">Visa</SelectItem>
                                                            <SelectItem value="mastercard">Mastercard</SelectItem>
                                                            <SelectItem value="elo">Elo</SelectItem>
                                                            <SelectItem value="amex">Amex</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader><CardTitle>4. Observações</CardTitle></CardHeader>
                                    <CardContent>
                                        <Textarea placeholder="Ex: sem cebola, ponto da carne, etc." value={observations} onChange={(e) => setObservations(e.target.value)} />
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader><CardTitle>Resumo do Pedido</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between"><span>Subtotal:</span><span>{formatPrice(totalPrice)}</span></div>
                                <div className="flex justify-between"><span>Taxa de Entrega:</span><span>{deliveryFee > 0 ? formatPrice(deliveryFee) : 'Grátis'}</span></div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total:</span><span>{formatPrice(finalTotal)}</span></div>
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
        </Layout>
    );
};