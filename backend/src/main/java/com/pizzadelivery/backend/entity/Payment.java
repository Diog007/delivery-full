package com.pizzadelivery.backend.entity;

import com.pizzadelivery.backend.enums.PaymentMethod;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Payment {

    @Enumerated(EnumType.STRING) // REFACTOR: Usa Enum para segurança de tipo
    private PaymentMethod method;

    // Os campos abaixo são relevantes apenas se o método for CARD
    private String cardBrand;
    private String cardType;
}