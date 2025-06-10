package com.pizzadelivery.backend.repository;

import com.pizzadelivery.backend.entity.CustomerUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerUserRepository extends JpaRepository<CustomerUser, String> {
    Optional<CustomerUser> findByEmail(String email);
    boolean existsByEmail(String email);
}
