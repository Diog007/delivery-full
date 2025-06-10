package com.pizzadelivery.backend.mappers;

import com.pizzadelivery.backend.dto.ResponseDtos;
import com.pizzadelivery.backend.entity.Order;
import java.util.stream.Collectors;

public class OrderMapper {

    public static ResponseDtos.OrderResponseDto toDto(Order order) {
        // Converte a lista de entidades OrderItem para uma lista de DTOs
        var itemDtos = order.getItems().stream()
                .map(item -> new ResponseDtos.OrderItemDto(
                        item.getId(),
                        item.getPizzaType(),
                        item.getFlavor(),
                        item.getExtras(),
                        item.getObservations(),
                        item.getQuantity(),
                        item.getTotalPrice()
                )).collect(Collectors.toList());

        // Converte a entidade CustomerUser para um DTO seguro
        var customerDto = new ResponseDtos.CustomerUserDto(
                order.getCustomerUser().getId(),
                order.getCustomerUser().getName(),
                order.getCustomerUser().getEmail()
        );

        // Monta e retorna o DTO de resposta final
        return new ResponseDtos.OrderResponseDto(
                order.getId(),
                itemDtos,
                customerDto,
                order.getDeliveryAddress(),
                order.getPayment(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getEstimatedDeliveryTime(),
                order.getTotalAmount(),
                order.getObservations()
        );
    }
}
