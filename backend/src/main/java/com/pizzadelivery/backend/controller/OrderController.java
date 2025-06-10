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
@CrossOrigin(origins = "http://localhost:8080")
public class OrderController {
    private final OrderService orderService;

    // Endpoint público para rastrear UM pedido
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDtos.OrderResponseDto> getOrderById(@PathVariable String id) {
        return orderService.getOrderById(id)
                .map(OrderMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * --- ENDPOINT CORRIGIDO ---
     * Endpoint para um CLIENTE criar um pedido. Agora requer autenticação.
     * O 'Principal' é injetado pelo Spring Security e contém o email do usuário logado.
     */
    @PostMapping
    public ResponseEntity<ResponseDtos.OrderResponseDto> createOrder(@RequestBody OrderDtos.CreateOrderDto orderDto, Principal principal) {
        // Validação para garantir que o usuário está autenticado
        if (principal == null || principal.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // Passa o email do usuário (principal.getName()) para o serviço
        Order createdOrder = orderService.createOrder(orderDto, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(OrderMapper.toDto(createdOrder));
    }
}