package com.pizzadelivery.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

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
}
