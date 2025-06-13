package com.pizzadelivery.backend.dto;

import java.util.List;

public class MenuDtos {
    public record ExtraUpdateRequest(
            String name,
            String description,
            double price,
            List<String> pizzaTypeIds
    ) {}

    public record CrustUpdateRequest(
            String name,
            String description,
            double price,
            List<String> pizzaTypeIds
    ) {}

    public record FlavorUpdateRequest(
            String name,
            String description,
            double price,
            List<String> pizzaTypeIds
    ) {}
}