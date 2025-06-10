package com.pizzadelivery.backend.controller;

import com.pizzadelivery.backend.dto.DashboardDtos;
import com.pizzadelivery.backend.dto.OrderDtos;
import com.pizzadelivery.backend.dto.ResponseDtos; // Importe os DTOs de resposta
import com.pizzadelivery.backend.entity.Order;
import com.pizzadelivery.backend.entity.PizzaExtra;
import com.pizzadelivery.backend.entity.PizzaFlavor;
import com.pizzadelivery.backend.entity.PizzaType;
import com.pizzadelivery.backend.mappers.OrderMapper; // Importe o Mapper
import com.pizzadelivery.backend.service.DashboardService;
import com.pizzadelivery.backend.service.MenuService;
import com.pizzadelivery.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors; // Importe o Collectors

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8080")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final DashboardService dashboardService;
    private final OrderService orderService;
    private final MenuService menuService;

    // --- MÉTODO CORRIGIDO ---
    @GetMapping("/orders")
    public ResponseEntity<List<ResponseDtos.OrderResponseDto>> getAllOrders() {
        // 1. Busca as entidades Order do serviço
        List<Order> orders = orderService.getAllOrders();

        // 2. Mapeia a lista de entidades para uma lista de DTOs usando o OrderMapper
        List<ResponseDtos.OrderResponseDto> orderDtos = orders.stream()
                .map(OrderMapper::toDto)
                .collect(Collectors.toList());

        // 3. Retorna a lista de DTOs, que é segura para ser serializada para JSON
        return ResponseEntity.ok(orderDtos);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardDtos.DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable String id, @RequestBody OrderDtos.OrderStatusUpdate statusUpdate) {
        return orderService.updateOrderStatus(id, statusUpdate.status())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Endpoints de Gerenciamento de Cardápio (sem alterações) ---
    @PostMapping("/types")
    public ResponseEntity<PizzaType> createType(@RequestBody PizzaType type) { return new ResponseEntity<>(menuService.saveType(type), HttpStatus.CREATED); }
    @PutMapping("/types/{id}")
    public ResponseEntity<PizzaType> updateType(@PathVariable String id, @RequestBody PizzaType type) { return ResponseEntity.ok(menuService.updateType(id, type)); }
    @DeleteMapping("/types/{id}")
    public ResponseEntity<Void> deleteType(@PathVariable String id) { menuService.deleteType(id); return ResponseEntity.noContent().build(); }

    @PostMapping("/flavors")
    public ResponseEntity<PizzaFlavor> createFlavor(@RequestBody PizzaFlavor flavor) { return new ResponseEntity<>(menuService.saveFlavor(flavor), HttpStatus.CREATED); }
    @PutMapping("/flavors/{id}")
    public ResponseEntity<PizzaFlavor> updateFlavor(@PathVariable String id, @RequestBody PizzaFlavor flavor) { return ResponseEntity.ok(menuService.updateFlavor(id, flavor)); }
    @DeleteMapping("/flavors/{id}")
    public ResponseEntity<Void> deleteFlavor(@PathVariable String id) { menuService.deleteFlavor(id); return ResponseEntity.noContent().build(); }

    @PostMapping("/extras")
    public ResponseEntity<PizzaExtra> createExtra(@RequestBody PizzaExtra extra) { return new ResponseEntity<>(menuService.saveExtra(extra), HttpStatus.CREATED); }
    @PutMapping("/extras/{id}")
    public ResponseEntity<PizzaExtra> updateExtra(@PathVariable String id, @RequestBody PizzaExtra extra) { return ResponseEntity.ok(menuService.updateExtra(id, extra)); }
    @DeleteMapping("/extras/{id}")
    public ResponseEntity<Void> deleteExtra(@PathVariable String id) { menuService.deleteExtra(id); return ResponseEntity.noContent().build(); }
}