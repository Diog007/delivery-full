package com.pizzadelivery.backend.repository;

import com.pizzadelivery.backend.entity.PizzaCrust;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PizzaCrustRepository extends JpaRepository<PizzaCrust, String> {
}
