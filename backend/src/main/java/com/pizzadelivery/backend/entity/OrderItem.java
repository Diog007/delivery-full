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

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "order_item_flavors",
            joinColumns = @JoinColumn(name = "order_item_id"),
            inverseJoinColumns = @JoinColumn(name = "flavor_id")
    )
    private List<PizzaFlavor> flavors;

    // --- CÓDIGO MODIFICADO ---
    // Removemos a relação ManyToMany direta com PizzaExtra
    // @ManyToMany(fetch = FetchType.EAGER)
    // private List<PizzaExtra> extras;

    // Adicionamos a nova relação com a entidade de ligação
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_item_id")
    private List<OrderItemExtra> appliedExtras;
    // --- FIM DA MODIFICAÇÃO ---

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "crust_id", nullable = true)
    private PizzaCrust crust;

    private String observations;
    private int quantity;
    private double totalPrice;
}