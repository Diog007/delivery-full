package com.pizzadelivery.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDateTime; // Import necessário
import java.util.List;

public class CustomerDtos {
    public record RegisterRequest(
            @NotEmpty String name,
            @Email @NotEmpty String email,
            @NotEmpty String password,
            String whatsapp,
            String cpf
    ) {}

    public record LoginRequest(@Email String email, @NotEmpty String password) {}

    public record LoginResponse(String token, String name, String email) {}

    public record AdminCustomerUpdateRequest(
            @NotEmpty String name,
            @Email @NotEmpty String email,
            String whatsapp,
            String cpf
    ) {}

    public record AddressDto(
            String id,
            String street,
            String number,
            String complement,
            String neighborhood,
            String city,
            String zipCode
    ) {}

    // --- INÍCIO DA ALTERAÇÃO ---
    // DTO de resposta para o admin com os novos campos
    public record CustomerResponseDto(
            String id,
            String name,
            String email,
            String whatsapp,
            String cpf,
            List<AddressDto> addresses,
            String googleId,
            String pictureUrl,
            boolean emailVerified,
            String locale,
            LocalDateTime lastLogin,
            LocalDateTime createdAt,
            // --- INÍCIO DA ALTERAÇÃO ---
            int totalOrders,
            double totalSpent
            // --- FIM DA ALTERAÇÃO ---
    ) {}
    // --- FIM DA ALTERAÇÃO ---
}