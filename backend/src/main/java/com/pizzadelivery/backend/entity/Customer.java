package com.pizzadelivery.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Customer {
    private String name;
    private String whatsapp;
    private String cpf;
    private String birthDate;
    private String email;
}
