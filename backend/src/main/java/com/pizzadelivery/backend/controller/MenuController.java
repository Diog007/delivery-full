package com.pizzadelivery.backend.controller;

import com.pizzadelivery.backend.entity.*;
import com.pizzadelivery.backend.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8080")
public class MenuController {

    private final MenuService menuService;

    @GetMapping("/types")
    public ResponseEntity<List<PizzaType>> getAllTypes() {
        return ResponseEntity.ok(menuService.getAllTypes());
    }

    @GetMapping("/flavors")
    public ResponseEntity<List<PizzaFlavor>> getAllFlavors() {
        return ResponseEntity.ok(menuService.getAllFlavors());
    }

    @GetMapping("/extras")
    public ResponseEntity<List<PizzaExtra>> getAllExtras() {
        return ResponseEntity.ok(menuService.getAllExtras());
    }

    @GetMapping("/types/{typeId}/extras")
    public ResponseEntity<List<PizzaExtra>> getExtrasForType(@PathVariable String typeId) {
        return ResponseEntity.ok(menuService.getExtrasByTypeId(typeId));
    }

    // --- NOVOS ENDPOINTS PARA BORDAS ---
    @GetMapping("/crusts")
    public ResponseEntity<List<PizzaCrust>> getAllCrusts() {
        return ResponseEntity.ok(menuService.getAllCrusts());
    }

    @GetMapping("/types/{typeId}/crusts")
    public ResponseEntity<List<PizzaCrust>> getCrustsForType(@PathVariable String typeId) {
        return ResponseEntity.ok(menuService.getCrustsByTypeId(typeId));
    }

    // --- NOVO ENDPOINT PÚBLICO PARA CATEGORIAS DE BEBIDA ---
    @GetMapping("/beverage-categories")
    public ResponseEntity<List<BeverageCategory>> getAllBeverageCategories() {
        return ResponseEntity.ok(menuService.getAllBeverageCategories());
    }

    @GetMapping("/beverages")
    public ResponseEntity<List<Beverage>> getAllBeverages() {
        return ResponseEntity.ok(menuService.getAllBeverages());
    }
}