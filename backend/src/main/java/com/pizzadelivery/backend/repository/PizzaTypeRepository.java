package com.pizzadelivery.backend.repository;

import com.pizzadelivery.backend.entity.PizzaType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PizzaTypeRepository extends JpaRepository<PizzaType, String> {}

