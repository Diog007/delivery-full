package com.pizzadelivery.backend.controller;

import com.pizzadelivery.backend.dto.OrderDtos;
import com.pizzadelivery.backend.dto.ResponseDtos;
import com.pizzadelivery.backend.entity.Order;
import com.pizzadelivery.backend.mappers.OrderMapper;
import com.pizzadelivery.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    // Endpoint público para rastrear UM pedido por ID.
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDtos.OrderResponseDto> getOrderById(@PathVariable String id) {
        return orderService.getOrderById(id)
                .map(OrderMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para um CLIENTE criar um pedido. Requer autenticação.
    @PostMapping
    public ResponseEntity<ResponseDtos.OrderResponseDto> createOrder(@RequestBody OrderDtos.CreateOrderDto orderDto, Principal principal) {
        if (principal == null || principal.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Order createdOrder = orderService.createOrder(orderDto, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(OrderMapper.toDto(createdOrder));
    }
}