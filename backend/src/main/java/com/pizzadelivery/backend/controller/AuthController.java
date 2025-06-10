package com.pizzadelivery.backend.controller;

import com.pizzadelivery.backend.dto.AuthDtos;
import com.pizzadelivery.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8080") // Frontend URL
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDtos.LoginResponse> login(@RequestBody AuthDtos.LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }
}
