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

    // DTO MODIFICADO para receber o ID da categoria
    public record BeverageRequestDto(
            String name,
            String description,
            double price,
            boolean alcoholic,
            String categoryId // <-- Adicionado
    ) {}

    // NOVO DTO para criar/atualizar categorias de bebida
    public record BeverageCategoryRequestDto(
            String name
    ) {}
}