package com.pizzadelivery.backend.controller;

import com.pizzadelivery.backend.dto.AuthDtos;
import com.pizzadelivery.backend.entity.PizzaExtra;
import com.pizzadelivery.backend.entity.PizzaFlavor;
import com.pizzadelivery.backend.entity.PizzaType;
import com.pizzadelivery.backend.service.AuthService;
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
}

