import { DeliveryAddress, DeliveryType, OrderStatus, Payment } from "@/types";

export namespace OrderDtos {
  export interface CartItemRequestDto {
    pizzaTypeId: string;
    flavorId: string;
    extraIds: string[];
    observations: string;
    quantity: number;
    totalPrice: number;
  }

  export interface CreateOrderDto {
    items: CartItemRequestDto[];
    deliveryType: DeliveryType;
    deliveryAddress?: DeliveryAddress;
    payment: Payment;
    status: OrderStatus;
    totalAmount: number;
    observations?: string;
  }
}

export namespace AuthDtos {
    export interface LoginResponse {
      token: string;
      name: string;
      email?: string;
    }

    export interface AdminLoginRequest {
        username: string;
        password: string;
    }
}

export namespace CustomerDtos {
    export interface AdminCustomerUpdateRequest {
      name: string;
      email: string;
      whatsapp: string;
      cpf: string;
    }
    
    export interface RegisterRequest {
        name: string;
        email: string;
        password: string;
        whatsapp?: string;
        cpf?: string;
    }

    export interface LoginRequest {
        email: string;
        password: string;
    }
}

// --- NAMESPACE ADICIONADO ---
export namespace MenuDtos {
    export interface ExtraUpdateRequest {
        name: string;
        description: string;
        price: number;
        pizzaTypeIds: string[];
    }
}
