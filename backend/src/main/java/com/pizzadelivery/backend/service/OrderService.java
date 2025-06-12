package com.pizzadelivery.backend.service;

import com.pizzadelivery.backend.dto.OrderDtos;
import com.pizzadelivery.backend.entity.*;
import com.pizzadelivery.backend.enums.DeliveryType;
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
    private final CustomerUserRepository customerUserRepository;
    private final AddressRepository addressRepository;

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
            PizzaType pizzaType = pizzaTypeRepository.findById(itemDto.pizzaTypeId())
                    .orElseThrow(() -> new RuntimeException("Tipo de Pizza não encontrado: " + itemDto.pizzaTypeId()));

            PizzaFlavor flavor = pizzaFlavorRepository.findById(itemDto.flavorId())
                    .orElseThrow(() -> new RuntimeException("Sabor não encontrado: " + itemDto.flavorId()));

            List<PizzaExtra> extras = pizzaExtraRepository.findAllById(itemDto.extraIds());

            return OrderItem.builder()
                    .pizzaType(pizzaType)
                    .flavor(flavor)
                    .extras(extras)
                    .observations(itemDto.observations())
                    .quantity(itemDto.quantity())
                    .totalPrice(itemDto.totalPrice())
                    .build();
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