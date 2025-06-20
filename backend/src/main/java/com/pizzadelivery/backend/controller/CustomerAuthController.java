package com.pizzadelivery.backend.controller;

import com.pizzadelivery.backend.dto.CustomerDtos;
import com.pizzadelivery.backend.entity.CustomerUser;
import com.pizzadelivery.backend.repository.CustomerUserRepository;
import com.pizzadelivery.backend.security.JwtTokenProvider;
import com.pizzadelivery.backend.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/customer/auth")
@RequiredArgsConstructor
public class CustomerAuthController {
    private final CustomerService customerService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomerUserRepository customerUserRepository;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody CustomerDtos.RegisterRequest req) {
        try {
            customerService.register(req);
            Map<String, String> response = Collections.singletonMap("message", "Usuário registrado com sucesso!");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // REFACTOR: Captura a exceção e retorna um erro 409 (Conflict) com uma mensagem clara.
            Map<String, String> errorResponse = Collections.singletonMap("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<CustomerDtos.LoginResponse> login(@Valid @RequestBody CustomerDtos.LoginRequest req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );

        String token = jwtTokenProvider.createToken(authentication);

        CustomerUser user = customerUserRepository.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("Erro inesperado ao buscar usuário após login."));

        return ResponseEntity.ok(new CustomerDtos.LoginResponse(token, user.getName(), user.getEmail()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> payload) {
        try {
            customerService.initiatePasswordReset(payload.get("email"));
            return ResponseEntity.ok(Collections.singletonMap("message", "Se um usuário com este e-mail existir, um link de redefinição foi enviado."));
        } catch (RuntimeException e) {



            // Mantém a resposta genérica para o frontend por segurança
            return ResponseEntity.ok(Collections.singletonMap("message", "Se um usuário com este e-mail existir, um link de redefinição foi enviado."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> payload) {
        try {
            String token = payload.get("token");
            String newPassword = payload.get("password");
            customerService.completePasswordReset(token, newPassword);
            return ResponseEntity.ok(Collections.singletonMap("message", "Senha redefinida com sucesso!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }
}