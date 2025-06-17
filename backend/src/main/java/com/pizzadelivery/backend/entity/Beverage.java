package com.pizzadelivery.backend.entity;

import jakarta.persistence.*; // Importe o ManyToOne e JoinColumn
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Beverage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String description;
    private double price;
    private String imageUrl;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean alcoholic = false;

    // A linha de categoria foi modificada para um relacionamento
    @ManyToOne
    @JoinColumn(name = "category_id")
    private BeverageCategory category;
}