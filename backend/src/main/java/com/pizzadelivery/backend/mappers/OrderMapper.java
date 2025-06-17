package com.pizzadelivery.backend.mappers;

import com.pizzadelivery.backend.dto.ResponseDtos;
import com.pizzadelivery.backend.entity.Order;
import com.pizzadelivery.backend.enums.OrderItemType;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {

    public static ResponseDtos.OrderResponseDto toDto(Order order) {
        if (order == null) {
            return null;
        }

        List<ResponseDtos.OrderItemDto> itemDtos = order.getItems().stream()
                .map(item -> {
                    // Mapeia os adicionais apenas se o item for uma Pizza
                    List<ResponseDtos.AppliedExtraDto> appliedExtrasDto = Collections.emptyList();
                    if (item.getItemType() == OrderItemType.PIZZA && item.getAppliedExtras() != null) {
                        appliedExtrasDto = item.getAppliedExtras().stream()
                                .map(appliedExtra -> new ResponseDtos.AppliedExtraDto(
                                        appliedExtra.getExtra(),
                                        appliedExtra.getAppliedToFlavor()
                                ))
                                .collect(Collectors.toList());
                    }

                    return new ResponseDtos.OrderItemDto(
                            item.getId(),
                            item.getItemType(),
                            item.getPizzaType(),
                            item.getFlavors(),
                            appliedExtrasDto,
                            item.getCrust(),
                            item.getBeverage(),
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
