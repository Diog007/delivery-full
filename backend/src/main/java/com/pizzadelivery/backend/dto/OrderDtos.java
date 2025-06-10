package com.pizzadelivery.backend.dto;

import com.pizzadelivery.backend.entity.Customer;
import com.pizzadelivery.backend.entity.DeliveryAddress;
import com.pizzadelivery.backend.entity.Payment;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDtos {

    public record OrderStatusUpdate(String status) {}

    // --- NOVO DTO PARA OS ITENS DA REQUISIÇÃO ---
    // Contém apenas os IDs e informações relevantes do item
    public record CartItemRequestDto(
            String pizzaTypeId,
            String flavorId,
            List<String> extraIds,
            String observations,
            int quantity,
            double totalPrice
    ) {}

    public record CreateOrderDto(
            List<CartItemRequestDto> items,
            // O campo 'customer' foi removido.
            String deliveryType,
            DeliveryAddress deliveryAddress,
            Payment payment,
            String status,
            double totalAmount,
            String observations,
            LocalDateTime createdAt,
            LocalDateTime estimatedDeliveryTime
    ) {}
}