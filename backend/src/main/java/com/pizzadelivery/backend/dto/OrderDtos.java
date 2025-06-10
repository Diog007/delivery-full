package com.pizzadelivery.backend.dto;

import com.pizzadelivery.backend.entity.DeliveryAddress;
import com.pizzadelivery.backend.entity.Payment;
import com.pizzadelivery.backend.enums.DeliveryType;
import com.pizzadelivery.backend.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDtos {

    // DTO para atualizar o status de um pedido. Usa o Enum.
    public record OrderStatusUpdate(OrderStatus status) {}

    // DTO para os itens do carrinho enviados na requisição.
    public record CartItemRequestDto(
            String pizzaTypeId,
            String flavorId,
            List<String> extraIds,
            String observations,
            int quantity,
            double totalPrice
    ) {}

    // DTO para a requisição de criação de pedido. Usa os Enums.
    public record CreateOrderDto(
            List<CartItemRequestDto> items,
            DeliveryType deliveryType,
            DeliveryAddress deliveryAddress,
            Payment payment,
            OrderStatus status,
            double totalAmount,
            String observations,
            LocalDateTime createdAt,
            LocalDateTime estimatedDeliveryTime
    ) {}
}