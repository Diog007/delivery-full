import { DeliveryAddress, DeliveryType, OrderStatus, Payment } from "@/types";

export namespace OrderDtos {
  export interface ExtraSelectionDto {
    extraId: string;
    flavorId: string | null;
  }

  export interface PizzaCartItemRequestDto {
    itemType: "PIZZA";
    pizzaTypeId: string;
    flavorIds: string[];
    extraSelections: ExtraSelectionDto[]; 
    crustId: string | null;
    observations: string;
    quantity: number;
    totalPrice: number;
  }

  export interface BeverageCartItemRequestDto {
    itemType: "BEVERAGE";
    beverageId: string;
    observations: string;
    quantity: number;
    totalPrice: number;
  }

  export type CartItemRequestDto = PizzaCartItemRequestDto | BeverageCartItemRequestDto;

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

export namespace MenuDtos {
    export interface ExtraUpdateRequest {
        name: string;
        description: string;
        price: number;
        pizzaTypeIds: string[];
    }
    
    export interface CrustUpdateRequest {
        name: string;
        description: string;
        price: number;
        pizzaTypeIds: string[];
    }

    export interface FlavorUpdateRequest {
        name: string;
        description: string;
        price: number;
        pizzaTypeIds: string[];
    }

    export interface BeverageRequestDto { // <-- MODIFIQUE ESTE DTO
        name: string;
        description: string;
        price: number;
        alcoholic: boolean;
        categoryId: string;
    }
}
