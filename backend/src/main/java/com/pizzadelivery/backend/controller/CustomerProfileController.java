package com.pizzadelivery.backend.controller;

import com.pizzadelivery.backend.dto.ResponseDtos;
import com.pizzadelivery.backend.entity.Order;
import com.pizzadelivery.backend.mappers.OrderMapper;
import com.pizzadelivery.backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerProfileController {

    private final CustomerService customerService;

    @GetMapping("/orders")
    public ResponseEntity<List<ResponseDtos.OrderResponseDto>> getOrderHistory(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Order> orders = customerService.findOrdersForCustomer(authentication.getName());
        List<ResponseDtos.OrderResponseDto> orderDtos = orders.stream()
                .map(OrderMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(orderDtos);
    }

    // ***** MÉTODO DE DEBUG ADICIONADO *****
    @GetMapping("/me/roles")
    public ResponseEntity<List<String>> getMyRoles(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        // Este endpoint retornará uma lista com as permissões do usuário logado.
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }
}