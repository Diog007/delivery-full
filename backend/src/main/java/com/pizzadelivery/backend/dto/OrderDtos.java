package com.pizzadelivery.backend.dto;

import com.pizzadelivery.backend.entity.DeliveryAddress;
import com.pizzadelivery.backend.entity.Payment;
import com.pizzadelivery.backend.enums.DeliveryType;
import com.pizzadelivery.backend.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDtos {

    public record OrderStatusUpdate(OrderStatus status) {}

    public record CartItemRequestDto(
            String pizzaTypeId,
            String flavorId,
            List<String> extraIds,
            String observations,
            int quantity,
            double totalPrice
    ) {}

    // --- CORREÇÃO APLICADA AQUI ---
    // Removido createdAt e estimatedDeliveryTime do DTO
    public record CreateOrderDto(
            List<CartItemRequestDto> items,
            DeliveryType deliveryType,
            DeliveryAddress deliveryAddress,
            Payment payment,
            OrderStatus status,
            double totalAmount,
            String observations
    ) {}
}