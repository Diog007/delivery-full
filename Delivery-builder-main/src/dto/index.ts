// REFACTOR: DTOs de requisição alinhados com o backend.

import { DeliveryAddress, DeliveryType, OrderStatus, Payment } from "@/types";

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
    deliveryType: DeliveryType;
    deliveryAddress?: DeliveryAddress;
    payment: Payment;
    status: OrderStatus;
    totalAmount: number;
    observations?: string;
    createdAt: Date; // O frontend envia um objeto Date, que será serializado para string
    estimatedDeliveryTime?: Date;
  }
}

export namespace AuthDtos {
    // Resposta do login de Admin ou Cliente
    export interface LoginResponse {
      token: string;
      name: string;
      email?: string; // Opcional, pois o admin não tem email
    }

    // Requisição de login de Admin
    export interface AdminLoginRequest {
        username,
        password
    }
}