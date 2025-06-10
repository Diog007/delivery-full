package com.pizzadelivery.backend.dto;

public class AuthDtos {
    public record LoginRequest(String username, String password) {}
    public record LoginResponse(String token, String name) {}
}
