package com.pizzadelivery.backend.repository;

import com.pizzadelivery.backend.entity.BeverageCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BeverageCategoryRepository extends JpaRepository<BeverageCategory, String> {
}