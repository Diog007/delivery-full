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
    switch (status) {
      case "received":
        return {
          label: "Pedido Recebido",
          variant: "secondary" as const,
          className: "bg-blue-100 text-blue-800",
        };
      case "preparing":
        return {
          label: "Em Preparo",
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800",
        };
      case "out_for_delivery":
        return {
          label: "Saiu para Entrega",
          variant: "secondary" as const,
          className: "bg-purple-100 text-purple-800",
        };
      case "completed":
        return {
          label: "Finalizado",
          variant: "secondary" as const,
          className: "bg-green-100 text-green-800",
        };
      case "cancelled":
        return {
          label: "Cancelado",
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800",
        };
      default:
        return {
          label: "Status Desconhecido",
          variant: "secondary" as const,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
};
