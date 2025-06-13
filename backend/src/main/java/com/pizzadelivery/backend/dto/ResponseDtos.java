package com.pizzadelivery.backend.dto;

import com.pizzadelivery.backend.entity.*;
import com.pizzadelivery.backend.enums.DeliveryType;
import com.pizzadelivery.backend.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public class ResponseDtos {

    public record CustomerUserDto(String id, String name, String email) {}

    public record OrderItemDto(
            String id,
            PizzaType pizzaType,
            PizzaFlavor flavor,
            List<PizzaExtra> extras,
            PizzaCrust crust, // --- CÓDIGO NOVO ---
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
