import React from 'react';
import { OrderStatus } from "@/types";
import { CheckCircle, Clock, Truck, Package, XCircle, ShoppingBag } from "lucide-react";

// Configuração de estilo e ícones para cada status de pedido
export const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string; }> = {
  RECEIVED: {
    label: "Recebido",
    icon: <Clock className="w-4 h-4 inline-block mr-1" />,
    color: "bg-blue-100 text-blue-800",
  },
  PREPARING: {
    label: "Em Preparo",
    icon: <Package className="w-4 h-4 inline-block mr-1" />,
    color: "bg-yellow-100 text-yellow-800",
  },
  OUT_FOR_DELIVERY: {
    label: "Em Rota",
    icon: <Truck className="w-4 h-4 inline-block mr-1" />,
    color: "bg-purple-100 text-purple-800",
  },
  COMPLETED: {
    label: "Finalizado",
    icon: <CheckCircle className="w-4 h-4 inline-block mr-1" />,
    color: "bg-green-100 text-green-800",
  },
  CANCELLED: {
    label: "Cancelado",
    icon: <XCircle className="w-4 h-4 inline-block mr-1" />,
    color: "bg-red-100 text-red-800",
  },
};

// Funções de formatação
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const formatTime = (dateString: string | Date) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};