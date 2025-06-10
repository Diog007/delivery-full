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
    // REFACTOR: O switch agora usa os valores do Enum em maiúsculas
    switch (status) {
      case "RECEIVED":
        return { label: "Recebido", className: "bg-blue-100 text-blue-800" };
      case "PREPARING":
        return { label: "Em Preparo", className: "bg-yellow-100 text-yellow-800" };
      case "OUT_FOR_DELIVERY":
        return { label: "Saiu para Entrega", className: "bg-purple-100 text-purple-800" };
      case "COMPLETED":
        return { label: "Finalizado", className: "bg-green-100 text-green-800" };
      case "CANCELLED":
        return { label: "Cancelado", className: "bg-red-100 text-red-800" };
      default:
        return { label: "Desconhecido", className: "bg-gray-100 text-gray-800" };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="secondary"
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
};