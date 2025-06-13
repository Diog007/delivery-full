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
public class PizzaFlavor {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "flavor_pizzatypes",
            joinColumns = @JoinColumn(name = "flavor_id"),
            inverseJoinColumns = @JoinColumn(name = "pizzatype_id")
    )
    private List<PizzaType> pizzaTypes;

    private double price;
    private String imageUrl;
}