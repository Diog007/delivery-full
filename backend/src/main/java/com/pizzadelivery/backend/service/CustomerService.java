package com.pizzadelivery.backend.service;

import com.pizzadelivery.backend.dto.CustomerDtos.RegisterRequest;
import com.pizzadelivery.backend.entity.CustomerUser;
import com.pizzadelivery.backend.entity.Order;
import com.pizzadelivery.backend.repository.CustomerUserRepository;
import com.pizzadelivery.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerUserRepository customerUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrderRepository orderRepository;

    public CustomerUser register(RegisterRequest req) {
        if (customerUserRepository.existsByEmail(req.email())) {
            throw new RuntimeException("Este e-mail já está em uso.");
        }
        CustomerUser newUser = CustomerUser.builder()
                .name(req.name())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .whatsapp(req.whatsapp())
                .cpf(req.cpf())
                .build();
        return customerUserRepository.save(newUser);
    }

    public List<Order> findOrdersForCustomer(String email) {
        CustomerUser customer = customerUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + email));

        return orderRepository.findByCustomerUser_IdOrderByCreatedAtDesc(customer.getId());
    }
}
