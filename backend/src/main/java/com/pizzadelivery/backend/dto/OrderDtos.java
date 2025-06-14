package com.pizzadelivery.backend.dto;

import com.pizzadelivery.backend.entity.DeliveryAddress;
import com.pizzadelivery.backend.entity.Payment;
import com.pizzadelivery.backend.enums.DeliveryType;
import com.pizzadelivery.backend.enums.OrderStatus;

import java.util.List;

public class OrderDtos {

    public record OrderStatusUpdate(OrderStatus status) {}

    // DTO para representar a seleção de um adicional
    public record ExtraSelectionDto(
            String extraId,
            String flavorId // Pode ser nulo se o adicional for na pizza toda
    ) {}

    public record CartItemRequestDto(
            String pizzaTypeId,
            List<String> flavorIds,
            List<ExtraSelectionDto> extraSelections, // MODIFICADO
            String crustId,
            String observations,
            int quantity,
            double totalPrice
    ) {}

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