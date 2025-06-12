package com.pizzadelivery.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

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

    /** DTO para o admin atualizar os dados de um cliente. */
    public record AdminCustomerUpdateRequest(
            @NotEmpty String name,
            @Email @NotEmpty String email,
            String whatsapp,
            String cpf
    ) {}

    /** DTO para um endereço individual, usado na resposta do cliente. */
    public record AddressDto(
            String id,
            String street,
            String number,
            String complement,
            String neighborhood,
            String city,
            String zipCode
    ) {}

    /** DTO para exibir os dados de um cliente para o admin, agora com endereços. */
    public record CustomerResponseDto(
            String id,
            String name,
            String email,
            String whatsapp,
            String cpf,
            List<AddressDto> addresses
    ) {}
}