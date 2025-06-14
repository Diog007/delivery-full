package com.pizzadelivery.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class OrderItemExtra {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JsonIgnore
    private OrderItem orderItem;

    @ManyToOne
    private PizzaExtra extra;

    // Sabor ao qual o adicional foi aplicado. Nulo se for na pizza inteira.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "applied_flavor_id", nullable = true)
    private PizzaFlavor appliedToFlavor;
}