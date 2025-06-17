package com.pizzadelivery.backend.entity;

import com.pizzadelivery.backend.enums.OrderItemType;
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

    @Enumerated(EnumType.STRING)
    private OrderItemType itemType;

    // Campos para PIZZA
    @ManyToOne
    @JoinColumn(name = "pizza_type_id", nullable = true)
    private PizzaType pizzaType;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "order_item_flavors",
            joinColumns = @JoinColumn(name = "order_item_id"),
            inverseJoinColumns = @JoinColumn(name = "flavor_id")
    )
    private List<PizzaFlavor> flavors;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_item_id")
    private List<OrderItemExtra> appliedExtras;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "crust_id", nullable = true)
    private PizzaCrust crust;

    // Campo para BEBIDA
    @ManyToOne
    @JoinColumn(name = "beverage_id", nullable = true)
    private Beverage beverage;

    // Campos comuns
    private String observations;
    private int quantity;
    private double totalPrice;
}