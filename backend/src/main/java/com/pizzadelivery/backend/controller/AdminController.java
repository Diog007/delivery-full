package com.pizzadelivery.backend.controller;

import com.pizzadelivery.backend.dto.*;
import com.pizzadelivery.backend.entity.*;
import com.pizzadelivery.backend.mappers.OrderMapper;
import com.pizzadelivery.backend.service.CustomerService;
import com.pizzadelivery.backend.service.DashboardService;
import com.pizzadelivery.backend.service.MenuService;
import com.pizzadelivery.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DashboardService dashboardService;
    private final OrderService orderService;
    private final MenuService menuService;
    private final CustomerService customerService;

    // ... Endpoints de Pedidos, Dashboard e Clientes (sem alteração)

    // --- Endpoints de Gerenciamento de Cardápio ---

    // --- TIPOS ---
    @PostMapping("/types")
    public ResponseEntity<PizzaType> createType(@RequestBody PizzaType type) {
        return new ResponseEntity<>(menuService.saveType(type), HttpStatus.CREATED);
    }
    @PutMapping("/types/{id}")
    public ResponseEntity<PizzaType> updateType(@PathVariable String id, @RequestBody PizzaType type) {
        return ResponseEntity.ok(menuService.updateType(id, type));
    }
    @PostMapping("/types/{id}/image")
    public ResponseEntity<PizzaType> uploadPizzaTypeImage(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(menuService.savePizzaTypeImage(id, file));
    }
    @DeleteMapping("/types/{id}")
    public ResponseEntity<Void> deleteType(@PathVariable String id) {
        menuService.deleteType(id);
        return ResponseEntity.noContent().build();
    }

    // --- SABORES ---
    @PostMapping("/flavors")
    public ResponseEntity<PizzaFlavor> createFlavor(@RequestBody PizzaFlavor flavor) {
        return new ResponseEntity<>(menuService.saveFlavor(flavor), HttpStatus.CREATED);
    }
    @PutMapping("/flavors/{id}")
    public ResponseEntity<PizzaFlavor> updateFlavor(@PathVariable String id, @RequestBody PizzaFlavor flavor) {
        return ResponseEntity.ok(menuService.updateFlavor(id, flavor));
    }
    @PostMapping("/flavors/{id}/image")
    public ResponseEntity<PizzaFlavor> uploadFlavorImage(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(menuService.saveFlavorImage(id, file));
    }
    @DeleteMapping("/flavors/{id}")
    public ResponseEntity<Void> deleteFlavor(@PathVariable String id) {
        menuService.deleteFlavor(id);
        return ResponseEntity.noContent().build();
    }

    // --- ADICIONAIS ---
    @PostMapping("/extras")
    public ResponseEntity<PizzaExtra> createExtra(@RequestBody MenuDtos.ExtraUpdateRequest extra) {
        return new ResponseEntity<>(menuService.saveExtra(extra), HttpStatus.CREATED);
    }
    @PutMapping("/extras/{id}")
    public ResponseEntity<PizzaExtra> updateExtra(@PathVariable String id, @RequestBody MenuDtos.ExtraUpdateRequest extra) {
        return ResponseEntity.ok(menuService.updateExtra(id, extra));
    }
    @DeleteMapping("/extras/{id}")
    public ResponseEntity<Void> deleteExtra(@PathVariable String id) {
        menuService.deleteExtra(id);
        return ResponseEntity.noContent().build();
    }

    // --- NOVOS ENDPOINTS PARA BORDAS ---
    @PostMapping("/crusts")
    public ResponseEntity<PizzaCrust> createCrust(@RequestBody MenuDtos.CrustUpdateRequest crust) {
        return new ResponseEntity<>(menuService.saveCrust(crust), HttpStatus.CREATED);
    }
    @PutMapping("/crusts/{id}")
    public ResponseEntity<PizzaCrust> updateCrust(@PathVariable String id, @RequestBody MenuDtos.CrustUpdateRequest crust) {
        return ResponseEntity.ok(menuService.updateCrust(id, crust));
    }
    @DeleteMapping("/crusts/{id}")
    public ResponseEntity<Void> deleteCrust(@PathVariable String id) {
        menuService.deleteCrust(id);
        return ResponseEntity.noContent().build();
    }
}
