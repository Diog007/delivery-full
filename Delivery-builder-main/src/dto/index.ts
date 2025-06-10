// Caminho: src/dto/index.ts

import { DeliveryAddress, Payment } from "@/types";

// Tipos para Autenticação
export namespace AuthDtos {
  export interface LoginResponse {
    token: string;
    name: string;
  }
}

// Tipos para a criação de Pedidos
export namespace OrderDtos {

  // DTO para os itens do carrinho enviados na requisição
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
    // O campo 'customer' é removido, pois o backend usa o token para identificar o cliente
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