package com.pizzadelivery.backend.repository;

import com.pizzadelivery.backend.entity.PizzaCrust;
import com.pizzadelivery.backend.entity.PizzaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PizzaTypeRepository extends JpaRepository<PizzaType, String> {

    @Query("SELECT pt FROM PizzaType pt JOIN pt.availableExtras e WHERE e.id = :extraId")
    List<PizzaType> findByAvailableExtrasId(@Param("extraId") String extraId);

    // --- CÓDIGO NOVO ---
    @Query("SELECT pt FROM PizzaType pt JOIN pt.availableCrusts c WHERE c.id = :crustId")
    List<PizzaType> findByAvailableCrustsId(@Param("crustId") String crustId);
}
