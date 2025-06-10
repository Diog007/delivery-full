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
public class DeliveryAddress {
    private String street;
    private String number;
    private String complement;
    private String neighborhood;
    private String city;
    private String zipCode;
}
