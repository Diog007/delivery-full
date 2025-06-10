package com.pizzadelivery.backend.dto;

import com.pizzadelivery.backend.entity.*;
import java.time.LocalDateTime;
import java.util.List;

// DTOs para formatar as respostas da API, evitando LazyInitializationException
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

    // A resposta completa do pedido que será enviada como JSON
    public record OrderResponseDto(
            String id,
            List<OrderItemDto> items,
            CustomerUserDto customerUser,
            DeliveryAddress deliveryAddress,
            Payment payment,
            String status,
            LocalDateTime createdAt,
            LocalDateTime estimatedDeliveryTime,
            double totalAmount,
            String observations
    ) {}
}
