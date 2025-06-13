package com.pizzadelivery.backend.repository;

import com.pizzadelivery.backend.entity.PizzaFlavor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PizzaFlavorRepository extends JpaRepository<PizzaFlavor, String> {
}
