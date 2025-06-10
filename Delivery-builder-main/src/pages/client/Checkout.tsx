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
import { Customer, DeliveryAddress, Payment } from "@/types";
// --- CORREÇÃO NA IMPORTAÇÃO ---
import { OrderDtos } from "@/dto";

// Define os tipos que vamos usar de forma mais clara
type CartItemRequestDto = OrderDtos.CartItemRequestDto;
type CreateOrderDto = OrderDtos.CreateOrderDto;


export const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { createOrder, isLoading } = useOrders();
  const { isAuthenticated, customerName, register } = useCustomerAuth();

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [customer, setCustomer] = useState<Customer & { password?: string }>({ name: "", whatsapp: "", cpf: "", birthDate: "", email: "", password: "" });
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({ street: "", number: "", complement: "", neighborhood: "", city: "", zipCode: "" });
  const [payment, setPayment] = useState<Payment>({ method: "cash" });
  const [observations, setObservations] = useState("");

  useEffect(() => {
    if (isAuthenticated && customerName) {
      setCustomer(prev => ({ ...prev, name: customerName, email: prev.email })); // Supondo que o email também viria de um fetch de perfil
    }
  }, [isAuthenticated, customerName]);

  const totalPrice = getTotalPrice();
  const deliveryFee = deliveryType === 'delivery' && totalPrice < 40 ? 5 : 0;
  const finalTotal = totalPrice + deliveryFee;

  const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  const validateForm = () => {
    if (!isAuthenticated && !customer.password) {
      alert("Por favor, crie uma senha para sua conta.");
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    if (!isAuthenticated) {
      const registrationSuccess = await register(customer);
      if (!registrationSuccess) {
        alert("Não foi possível criar sua conta. Verifique os dados e tente novamente.");
        return;
      }
    }

    try {
      // --- CORREÇÃO NO USO DO TIPO ---
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
      alert("Ocorreu um erro ao processar seu pedido. O token pode ter expirado. Por favor, faça login novamente.");
    }
  };

  if (items.length === 0 && !isLoading) {
    navigate("/cart");
    return null;
  }

  // O restante do seu JSX continua o mesmo...
  return (
    <Layout>
      <LoginModal open={isLoginModalOpen} setOpen={setLoginModalOpen} />
      <div className="container mx-auto px-4 py-8">
        {/* ... todo o seu JSX ... */}
      </div>
    </Layout>
  );
};