package com.pizzadelivery.backend.dto;

import java.util.List;

public class MenuDtos {
    public record ExtraUpdateRequest(
            String name,
            String description,
            double price,
            List<String> pizzaTypeIds
    ) {}

    // --- CÓDIGO NOVO ---
    public record CrustUpdateRequest(
            String name,
            String description,
            double price,
            List<String> pizzaTypeIds
    ) {}
}
