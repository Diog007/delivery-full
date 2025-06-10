package com.pizzadelivery.backend.controller;

import com.pizzadelivery.backend.dto.ResponseDtos;
import com.pizzadelivery.backend.entity.Order;
import com.pizzadelivery.backend.mappers.OrderMapper;
import com.pizzadelivery.backend.service.CustomerService; // Importe o CustomerService
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8080")
public class CustomerProfileController {

    // Agora injetamos o CustomerService em vez dos repositórios
    private final CustomerService customerService;

    @GetMapping("/orders")
    public ResponseEntity<List<ResponseDtos.OrderResponseDto>> getOrderHistory(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        // 1. Delega a busca de pedidos para o serviço
        List<Order> orders = customerService.findOrdersForCustomer(authentication.getName());

        // 2. Mapeia a lista de entidades para uma lista de DTOs
        List<ResponseDtos.OrderResponseDto> orderDtos = orders.stream()
                .map(OrderMapper::toDto)
                .collect(Collectors.toList());

        // 3. Retorna a lista de DTOs
        return ResponseEntity.ok(orderDtos);
    }
}