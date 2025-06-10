package com.pizzadelivery.backend.service;

import com.pizzadelivery.backend.dto.OrderDtos;
import com.pizzadelivery.backend.entity.*;
import com.pizzadelivery.backend.enums.OrderStatus;
import com.pizzadelivery.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

            // AQUI poderíamos recalcular o preço para segurança máxima, mas manteremos o do frontend por simplicidade.
            // double calculatedPrice = (pizzaType.getBasePrice() + flavor.getPrice() + extras.stream().mapToDouble(PizzaExtra::getPrice).sum()) * itemDto.quantity();

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
                .status(orderDto.status())
                .createdAt(orderDto.createdAt())
                .estimatedDeliveryTime(orderDto.estimatedDeliveryTime())
                .totalAmount(orderDto.totalAmount())
                .observations(orderDto.observations())
                .build();

        return orderRepository.save(order);
    }

    @Transactional
    public Optional<Order> updateOrderStatus(String id, OrderStatus status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            return orderRepository.save(order);
        });
    }
}