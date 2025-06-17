package com.pizzadelivery.backend.dto;

import com.pizzadelivery.backend.entity.*;
import com.pizzadelivery.backend.enums.DeliveryType;
import com.pizzadelivery.backend.enums.OrderItemType;
import com.pizzadelivery.backend.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public class ResponseDtos {

    public record CustomerUserDto(String id, String name, String email) {}

    public record AppliedExtraDto(
            PizzaExtra extra,
            PizzaFlavor onFlavor
    ) {}

    // DTO Corrigido para OrderItem
    public record OrderItemDto(
            String id,
            OrderItemType itemType,
            // Campos de Pizza (podem ser nulos)
            PizzaType pizzaType,
            List<PizzaFlavor> flavors,
            List<AppliedExtraDto> appliedExtras,
            PizzaCrust crust,
            // Campo de Bebida (pode ser nulo)
            Beverage beverage,
            // Campos Comuns
            String observations,
            int quantity,
            double totalPrice
    ) {}

    public record OrderResponseDto(
            String id,
            List<OrderItemDto> items,
            CustomerUserDto customerUser,
            DeliveryType deliveryType,
            DeliveryAddress deliveryAddress,
            Payment payment,
            OrderStatus status,
            LocalDateTime createdAt,
            LocalDateTime estimatedDeliveryTime,
            double totalAmount,
            String observations
    ) {}
}
