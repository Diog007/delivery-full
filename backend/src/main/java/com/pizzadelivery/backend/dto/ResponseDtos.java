package com.pizzadelivery.backend.dto;

import com.pizzadelivery.backend.entity.*;
import com.pizzadelivery.backend.enums.DeliveryType;
import com.pizzadelivery.backend.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public class ResponseDtos {

    // Representação segura de um usuário para a API
    public record CustomerUserDto(String id, String name, String email) {}

    // Representação de um item do pedido para a API
    public record OrderItemDto(
            String id,
            PizzaType pizzaType,
            PizzaFlavor flavor,
            List<PizzaExtra> extras,
            String observations,
            int quantity,
            double totalPrice
    ) {}

    // A resposta completa do pedido que será enviada como JSON. Usa os Enums.
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