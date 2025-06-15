package com.pizzadelivery.backend.repository;

import com.pizzadelivery.backend.entity.Beverage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BeverageRepository extends JpaRepository<Beverage, String> {
}