package com.pizzadelivery.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class PizzaType {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String description;
    private double basePrice;
    private String imageUrl;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "pizza_type_extras",
            joinColumns = @JoinColumn(name = "pizza_type_id"),
            inverseJoinColumns = @JoinColumn(name = "pizza_extra_id")
    )
    private List<PizzaExtra> availableExtras;

    // --- CÓDIGO NOVO ---
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "pizza_type_crusts",
            joinColumns = @JoinColumn(name = "pizza_type_id"),
            inverseJoinColumns = @JoinColumn(name = "pizza_crust_id")
    )
    private List<PizzaCrust> availableCrusts;
}
