package com.pizzadelivery.backend.dto;

import com.pizzadelivery.backend.entity.*;
import com.pizzadelivery.backend.enums.DeliveryType;
import com.pizzadelivery.backend.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public class ResponseDtos {

    public record CustomerUserDto(String id, String name, String email) {}

    // DTO para representar um adicional aplicado e sua posição
    public record AppliedExtraDto(
            PizzaExtra extra,
            PizzaFlavor onFlavor // Nulo se for na pizza toda
    ) {}

    public record OrderItemDto(
            String id,
            PizzaType pizzaType,
            List<PizzaFlavor> flavors,
            List<AppliedExtraDto> appliedExtras, // MODIFICADO
            PizzaCrust crust,
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