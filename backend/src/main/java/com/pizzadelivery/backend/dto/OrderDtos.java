package com.pizzadelivery.backend.dto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.pizzadelivery.backend.entity.DeliveryAddress;
import com.pizzadelivery.backend.entity.Payment;
import com.pizzadelivery.backend.enums.DeliveryType;
import com.pizzadelivery.backend.enums.OrderItemType;
import com.pizzadelivery.backend.enums.OrderStatus;

import java.util.List;

public class OrderDtos {

    public record OrderStatusUpdate(OrderStatus status) {}

    public record ExtraSelectionDto(
            String extraId,
            String flavorId // Pode ser nulo se o adicional for na pizza toda
    ) {}

    // --- DTO Base para itens do carrinho ---
    @JsonTypeInfo(
            use = JsonTypeInfo.Id.NAME,
            include = JsonTypeInfo.As.PROPERTY,
            property = "itemType"
    )
    @JsonSubTypes({
            @JsonSubTypes.Type(value = PizzaCartItemRequestDto.class, name = "PIZZA"),
            @JsonSubTypes.Type(value = BeverageCartItemRequestDto.class, name = "BEVERAGE")
    })
    public sealed interface CartItemRequestDto permits PizzaCartItemRequestDto, BeverageCartItemRequestDto {
        OrderItemType getItemType();
        int getQuantity();
        double getTotalPrice();
        String getObservations();
    }

    // --- DTO específico para Pizza ---
    public static final class PizzaCartItemRequestDto implements CartItemRequestDto {
        private String pizzaTypeId;
        private List<String> flavorIds;
        private List<ExtraSelectionDto> extraSelections;
        private String crustId;
        private String observations;
        private int quantity;
        private double totalPrice;

        // Getters
        public String getPizzaTypeId() { return pizzaTypeId; }
        public List<String> getFlavorIds() { return flavorIds; }
        public List<ExtraSelectionDto> getExtraSelections() { return extraSelections; }
        public String getCrustId() { return crustId; }
        @Override public String getObservations() { return observations; }
        @Override public int getQuantity() { return quantity; }
        @Override public double getTotalPrice() { return totalPrice; }
        @Override public OrderItemType getItemType() { return OrderItemType.PIZZA; }
    }

    // --- DTO específico para Bebida ---
    public static final class BeverageCartItemRequestDto implements CartItemRequestDto {
        private String beverageId;
        private String observations;
        private int quantity;
        private double totalPrice;

        // Getters
        public String getBeverageId() { return beverageId; }
        @Override public String getObservations() { return observations; }
        @Override public int getQuantity() { return quantity; }
        @Override public double getTotalPrice() { return totalPrice; }
        @Override public OrderItemType getItemType() { return OrderItemType.BEVERAGE; }
    }


    // --- DTO para criar o pedido ---
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