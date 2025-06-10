package com.pizzadelivery.backend.service;

import com.pizzadelivery.backend.dto.AuthDtos;
import com.pizzadelivery.backend.entity.Admin;
import com.pizzadelivery.backend.repository.AdminRepository;
import com.pizzadelivery.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AdminRepository adminRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthDtos.LoginResponse login(AuthDtos.LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password()));

        Admin admin = adminRepository.findByUsername(loginRequest.username())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        String token = jwtTokenProvider.createToken(authentication);
        return new AuthDtos.LoginResponse(token, admin.getName());
    }
}
