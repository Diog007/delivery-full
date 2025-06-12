package com.pizzadelivery.backend.controller;

import com.pizzadelivery.backend.dto.CustomerDtos;
import com.pizzadelivery.backend.dto.DashboardDtos;
import com.pizzadelivery.backend.dto.OrderDtos;
import com.pizzadelivery.backend.dto.ResponseDtos;
import com.pizzadelivery.backend.entity.Order;
import com.pizzadelivery.backend.entity.PizzaExtra;
import com.pizzadelivery.backend.entity.PizzaFlavor;
import com.pizzadelivery.backend.entity.PizzaType;
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

    @GetMapping("/orders")
    public ResponseEntity<List<ResponseDtos.OrderResponseDto>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        List<ResponseDtos.OrderResponseDto> orderDtos = orders.stream()
                .map(OrderMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderDtos);
    }


    @GetMapping("/dashboard/weekly-sales")
    public ResponseEntity<List<DashboardDtos.DailySale>> getWeeklySales() {
        return ResponseEntity.ok(dashboardService.getWeeklySalesChartData());
    }

    @GetMapping("/dashboard/sales-by-type")
    public ResponseEntity<List<DashboardDtos.SalesByPizzaType>> getSalesByType() {
        return ResponseEntity.ok(dashboardService.getSalesByPizzaTypeChartData());
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardDtos.DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @PostMapping("/flavors/{id}/image")
    public ResponseEntity<PizzaFlavor> uploadFlavorImage(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(menuService.saveFlavorImage(id, file));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<ResponseDtos.OrderResponseDto> updateOrderStatus(@PathVariable String id, @RequestBody OrderDtos.OrderStatusUpdate statusUpdate) {
        return orderService.updateOrderStatus(id, statusUpdate.status())
                .map(OrderMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDtos.CustomerResponseDto>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<CustomerDtos.CustomerResponseDto> updateCustomer(@PathVariable String id, @RequestBody CustomerDtos.AdminCustomerUpdateRequest updateRequest) {
        return ResponseEntity.ok(customerService.updateCustomer(id, updateRequest));
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomerById(id);
        return ResponseEntity.noContent().build();
    }


    // --- Endpoints de Gerenciamento de Cardápio ---
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

    @PostMapping("/flavors")
    public ResponseEntity<PizzaFlavor> createFlavor(@RequestBody PizzaFlavor flavor) {
        return new ResponseEntity<>(menuService.saveFlavor(flavor), HttpStatus.CREATED);
    }
    @PutMapping("/flavors/{id}")
    public ResponseEntity<PizzaFlavor> updateFlavor(@PathVariable String id, @RequestBody PizzaFlavor flavor) {
        return ResponseEntity.ok(menuService.updateFlavor(id, flavor));
    }
    @DeleteMapping("/flavors/{id}")
    public ResponseEntity<Void> deleteFlavor(@PathVariable String id) {
        menuService.deleteFlavor(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/extras")
    public ResponseEntity<PizzaExtra> createExtra(@RequestBody PizzaExtra extra) {
        return new ResponseEntity<>(menuService.saveExtra(extra), HttpStatus.CREATED);
    }
    @PutMapping("/extras/{id}")
    public ResponseEntity<PizzaExtra> updateExtra(@PathVariable String id, @RequestBody PizzaExtra extra) {
        return ResponseEntity.ok(menuService.updateExtra(id, extra));
    }
    @DeleteMapping("/extras/{id}")
    public ResponseEntity<Void> deleteExtra(@PathVariable String id) {
        menuService.deleteExtra(id);
        return ResponseEntity.noContent().build();
    }
}