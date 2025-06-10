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
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    private PizzaType pizzaType;

    @ManyToOne
    private PizzaFlavor flavor;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<PizzaExtra> extras;

    private String observations;
    private int quantity;
    private double totalPrice;
}
