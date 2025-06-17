package com.pizzadelivery.backend.service;

import com.pizzadelivery.backend.dto.OrderDtos;
import com.pizzadelivery.backend.dto.OrderDtos.BeverageCartItemRequestDto;
import com.pizzadelivery.backend.dto.OrderDtos.CartItemRequestDto;
import com.pizzadelivery.backend.dto.OrderDtos.PizzaCartItemRequestDto;
import com.pizzadelivery.backend.entity.*;
import com.pizzadelivery.backend.enums.DeliveryType;
import com.pizzadelivery.backend.enums.OrderItemType;
import com.pizzadelivery.backend.enums.OrderStatus;
import com.pizzadelivery.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PizzaTypeRepository pizzaTypeRepository;
    private final PizzaFlavorRepository pizzaFlavorRepository;
    private final PizzaExtraRepository pizzaExtraRepository;
    private final PizzaCrustRepository pizzaCrustRepository;
    private final CustomerUserRepository customerUserRepository;
    private final AddressRepository addressRepository;
    private final BeverageRepository beverageRepository; // NOVO

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    @Transactional
    public Order createOrder(OrderDtos.CreateOrderDto orderDto, String userEmail) {
        CustomerUser customer = customerUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Cliente com email " + userEmail + " não encontrado."));

        List<OrderItem> orderItems = orderDto.items().stream().map(itemDto -> {
            if (itemDto.getItemType() == OrderItemType.PIZZA) {
                return createPizzaOrderItem((PizzaCartItemRequestDto) itemDto);
            } else if (itemDto.getItemType() == OrderItemType.BEVERAGE) {
                return createBeverageOrderItem((BeverageCartItemRequestDto) itemDto);
            }
            throw new IllegalArgumentException("Tipo de item de pedido desconhecido.");
        }).collect(Collectors.toList());

        Order order = Order.builder()
                .items(orderItems)
                .customerUser(customer)
                .deliveryType(orderDto.deliveryType())
                .deliveryAddress(orderDto.deliveryAddress())
                .payment(orderDto.payment())
                .status(OrderStatus.RECEIVED)
                .createdAt(LocalDateTime.now())
                .estimatedDeliveryTime(LocalDateTime.now().plusMinutes(45))
                .totalAmount(orderDto.totalAmount())
                .observations(orderDto.observations())
                .build();

        if (orderDto.deliveryType() == DeliveryType.DELIVERY && orderDto.deliveryAddress() != null) {
            saveAddressForCustomer(customer, orderDto.deliveryAddress());
        }

        return orderRepository.save(order);
    }

    private OrderItem createPizzaOrderItem(PizzaCartItemRequestDto itemDto) {
        PizzaType pizzaType = pizzaTypeRepository.findById(itemDto.getPizzaTypeId())
                .orElseThrow(() -> new RuntimeException("Tipo de Pizza não encontrado: " + itemDto.getPizzaTypeId()));

        List<PizzaFlavor> flavors = pizzaFlavorRepository.findAllById(itemDto.getFlavorIds());
        if (flavors.isEmpty()) {
            throw new RuntimeException("Pelo menos um sabor deve ser selecionado.");
        }

        PizzaCrust crust = null;
        if (itemDto.getCrustId() != null && !itemDto.getCrustId().isEmpty()) {
            crust = pizzaCrustRepository.findById(itemDto.getCrustId())
                    .orElseThrow(() -> new RuntimeException("Borda não encontrada: " + itemDto.getCrustId()));
        }

        List<OrderItemExtra> appliedExtras = itemDto.getExtraSelections().stream().map(selection -> {
            PizzaExtra extra = pizzaExtraRepository.findById(selection.extraId())
                    .orElseThrow(() -> new RuntimeException("Adicional não encontrado: " + selection.extraId()));

            PizzaFlavor appliedToFlavor = null;
            if (selection.flavorId() != null) {
                appliedToFlavor = pizzaFlavorRepository.findById(selection.flavorId())
                        .orElseThrow(() -> new RuntimeException("Sabor para o adicional não encontrado: " + selection.flavorId()));
            }

            return OrderItemExtra.builder()
                    .extra(extra)
                    .appliedToFlavor(appliedToFlavor)
                    .build();
        }).collect(Collectors.toList());

        return OrderItem.builder()
                .itemType(OrderItemType.PIZZA)
                .pizzaType(pizzaType)
                .flavors(flavors)
                .appliedExtras(appliedExtras)
                .crust(crust)
                .observations(itemDto.getObservations())
                .quantity(itemDto.getQuantity())
                .totalPrice(itemDto.getTotalPrice())
                .build();
    }

    private OrderItem createBeverageOrderItem(BeverageCartItemRequestDto itemDto) {
        Beverage beverage = beverageRepository.findById(itemDto.getBeverageId())
                .orElseThrow(() -> new RuntimeException("Bebida não encontrada: " + itemDto.getBeverageId()));

        return OrderItem.builder()
                .itemType(OrderItemType.BEVERAGE)
                .beverage(beverage)
                .quantity(itemDto.getQuantity())
                .totalPrice(itemDto.getTotalPrice())
                .observations(itemDto.getObservations())
                .build();
    }


    private void saveAddressForCustomer(CustomerUser customer, DeliveryAddress deliveryAddress) {
        boolean addressExists = customer.getAddresses().stream().anyMatch(existingAddress ->
                Objects.equals(existingAddress.getZipCode(), deliveryAddress.getZipCode()) &&
                        Objects.equals(existingAddress.getStreet(), deliveryAddress.getStreet()) &&
                        Objects.equals(existingAddress.getNumber(), deliveryAddress.getNumber())
        );

        if (!addressExists) {
            Address newAddress = Address.builder()
                    .street(deliveryAddress.getStreet())
                    .number(deliveryAddress.getNumber())
                    .complement(deliveryAddress.getComplement())
                    .neighborhood(deliveryAddress.getNeighborhood())
                    .city(deliveryAddress.getCity())
                    .zipCode(deliveryAddress.getZipCode())
                    .customer(customer)
                    .build();
            addressRepository.save(newAddress);
        }
    }

    @Transactional
    public Optional<Order> updateOrderStatus(String id, OrderStatus status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            return orderRepository.save(order);
        });
    }
}