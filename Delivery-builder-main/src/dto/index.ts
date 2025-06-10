// Caminho: src/dto/index.ts

import { DeliveryAddress, Payment } from "@/types";

// Tipos para Autenticação
export namespace AuthDtos {
  export interface LoginResponse {
    token: string;
    name: string;
  }
}

/**
 * --- DTOs CORRIGIDOS ---
 * Tipos para a criação de Pedidos, alinhados com o backend.
 */
export namespace OrderDtos {

  // DTO para os itens do carrinho enviados na requisição (usando IDs)
  export interface CartItemRequestDto {
    pizzaTypeId: string;
    flavorId: string;
    extraIds: string[];
    observations: string;
    quantity: number;
    totalPrice: number;
  }

  // DTO para a requisição de criação de pedido
  export interface CreateOrderDto {
    items: CartItemRequestDto[];
    deliveryType: "delivery" | "pickup";
    deliveryAddress?: DeliveryAddress;
    payment: Payment;
    status: string;
    totalAmount: number;
    observations?: string;
    createdAt: Date;
    estimatedDeliveryTime: Date;
  }
}