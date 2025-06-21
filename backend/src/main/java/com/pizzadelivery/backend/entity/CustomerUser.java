package com.pizzadelivery.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "customer_users")
public class CustomerUser {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    private String password;

    private String whatsapp;
    private String cpf;

    @Column(unique = true)
    private String googleId;

    private String pictureUrl;

    private Boolean emailVerified;

    private String locale;

    private LocalDateTime lastLogin;

    // --- INÍCIO DA CORREÇÃO ---
    // A propriedade nullable = false foi removida para permitir que o Hibernate
    // adicione a coluna em tabelas que já contêm dados.
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    // --- FIM DA CORREÇÃO ---

    private String passwordResetToken;
    private LocalDateTime passwordResetTokenExpiry;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses;
}