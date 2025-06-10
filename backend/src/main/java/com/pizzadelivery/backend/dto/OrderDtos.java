package com.pizzadelivery.backend.dto;

import com.pizzadelivery.backend.entity.DeliveryAddress;
import com.pizzadelivery.backend.entity.Payment;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDtos {

    public record OrderStatusUpdate(String status) {}

    /**
     * --- DTO CORRIGIDO ---
     * DTO para os itens do carrinho enviados na requisição.
     * Contém apenas os IDs e informações relevantes, evitando que o cliente manipule preços.
     */
    public record CartItemRequestDto(
            String pizzaTypeId,
            String flavorId,
            List<String> extraIds,
            String observations,
            int quantity,
            double totalPrice // O preço total do item é calculado no front, mas validado no back se necessário
    ) {}

    /**
     * --- DTO CORRIGIDO ---
     * DTO para a requisição de criação de pedido. O campo 'customer' foi removido,
     * pois o backend agora identifica o cliente pelo token de autenticação.
     */
    public record CreateOrderDto(
            List<CartItemRequestDto> items,
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