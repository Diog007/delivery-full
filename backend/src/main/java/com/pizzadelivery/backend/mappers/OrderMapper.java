package com.pizzadelivery.backend.mappers;

import com.pizzadelivery.backend.dto.ResponseDtos;
import com.pizzadelivery.backend.entity.Order;
import java.util.stream.Collectors;

public class OrderMapper {

    public static ResponseDtos.OrderResponseDto toDto(Order order) {
        if (order == null) {
            return null;
        }

        var itemDtos = order.getItems().stream()
                .map(item -> {
                    // Mapeia os adicionais aplicados
                    var appliedExtrasDto = item.getAppliedExtras().stream()
                            .map(appliedExtra -> new ResponseDtos.AppliedExtraDto(
                                    appliedExtra.getExtra(),
                                    appliedExtra.getAppliedToFlavor()
                            ))
                            .collect(Collectors.toList());

                    return new ResponseDtos.OrderItemDto(
                            item.getId(),
                            item.getPizzaType(),
                            item.getFlavors(),
                            appliedExtrasDto, // MODIFICADO
                            item.getCrust(),
                            item.getObservations(),
                            item.getQuantity(),
                            item.getTotalPrice()
                    );
                }).collect(Collectors.toList());

        var customerDto = new ResponseDtos.CustomerUserDto(
                order.getCustomerUser().getId(),
                order.getCustomerUser().getName(),
                order.getCustomerUser().getEmail()
        );

        return new ResponseDtos.OrderResponseDto(
                order.getId(),
                itemDtos,
                customerDto,
                order.getDeliveryType(),
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