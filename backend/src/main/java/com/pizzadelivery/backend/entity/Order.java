package com.pizzadelivery.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> items;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_user_id")
    private CustomerUser customerUser;

    // --- ADICIONE A LINHA ABAIXO ---
    private String deliveryType;

    @Embedded
    private DeliveryAddress deliveryAddress;

    @Embedded
    private Payment payment;

    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime estimatedDeliveryTime;
    private double totalAmount;
    private String observations;
}
