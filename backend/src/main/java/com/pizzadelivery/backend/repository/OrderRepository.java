package com.pizzadelivery.backend.repository;

import com.pizzadelivery.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    // NOVO MÉTODO
    List<Order> findByCustomerUser_IdOrderByCreatedAtDesc(String customerId);
}
