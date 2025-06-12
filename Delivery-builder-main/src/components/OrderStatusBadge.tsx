import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const OrderStatusBadge = ({
  status,
  className,
}: OrderStatusBadgeProps) => {
  const getStatusConfig = (status: OrderStatus) => {
    // REFACTOR: O switch agora usa os valores do Enum e retorna cores distintas
    switch (status) {
      case "RECEIVED":
        return { label: "Recebido", className: "bg-blue-100 text-blue-800 border-blue-200" };
      case "PREPARING":
        return { label: "Em Preparo", className: "bg-orange-100 text-orange-800 border-orange-200" };
      case "OUT_FOR_DELIVERY":
        return { label: "Saiu para Entrega", className: "bg-purple-100 text-purple-800 border-purple-200" };
      case "COMPLETED":
        return { label: "Finalizado", className: "bg-green-100 text-green-800 border-green-200" };
      case "CANCELLED":
        return { label: "Cancelado", className: "bg-red-100 text-red-800 border-red-200" };
      default:
        return { label: "Desconhecido", className: "bg-gray-100 text-gray-800 border-gray-200" };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline" // Usamos outline para que a borda colorida apareça
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
};