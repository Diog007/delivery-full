package com.pizzadelivery.backend.entity;

import com.pizzadelivery.backend.enums.DeliveryType;
import com.pizzadelivery.backend.enums.OrderStatus;
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
    @JoinColumn(name = "order_id") // Garante a chave estrangeira na tabela OrderItem
    private List<OrderItem> items;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_user_id")
    private CustomerUser customerUser;

    @Enumerated(EnumType.STRING) // REFACTOR: Usa Enum para segurança de tipo
    private DeliveryType deliveryType;

    @Embedded
    private DeliveryAddress deliveryAddress;

    @Embedded
    private Payment payment;

    @Enumerated(EnumType.STRING) // REFACTOR: Usa Enum para segurança de tipo
    private OrderStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime estimatedDeliveryTime;
    private double totalAmount;
    private String observations;
}