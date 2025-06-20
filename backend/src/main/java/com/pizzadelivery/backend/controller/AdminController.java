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
@CrossOrigin(origins = "http://localhost:8080")
public class AdminController {

    private final DashboardService dashboardService;
    private final OrderService orderService;
    private final MenuService menuService;
    private final CustomerService customerService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardDtos.DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/dashboard/weekly-sales")
    public ResponseEntity<List<DashboardDtos.DailySale>> getWeeklySales() {
        return ResponseEntity.ok(dashboardService.getWeeklySalesChartData());
    }

    @GetMapping("/dashboard/sales-by-type")
    public ResponseEntity<List<DashboardDtos.SalesByPizzaType>> getSalesByType() {
        return ResponseEntity.ok(dashboardService.getSalesByPizzaTypeChartData());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<ResponseDtos.OrderResponseDto>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        List<ResponseDtos.OrderResponseDto> dtos = orders.stream()
                .map(OrderMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
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

    @PutMapping("/addresses/{id}")
    public ResponseEntity<CustomerDtos.AddressDto> updateAddress(@PathVariable String id, @RequestBody CustomerDtos.AddressDto addressDto) {
        return ResponseEntity.ok(customerService.updateAddress(id, addressDto));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable String id) {
        customerService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

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
    public ResponseEntity<PizzaFlavor> createFlavor(@RequestBody MenuDtos.FlavorUpdateRequest flavorDto) {
        return new ResponseEntity<>(menuService.saveFlavor(flavorDto), HttpStatus.CREATED);
    }
    @PutMapping("/flavors/{id}")
    public ResponseEntity<PizzaFlavor> updateFlavor(@PathVariable String id, @RequestBody MenuDtos.FlavorUpdateRequest flavorDto) {
        return ResponseEntity.ok(menuService.updateFlavor(id, flavorDto));
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

    // --- BORDAS ---
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

    // --- CATEGORIAS DE BEBIDA (NOVO) ---
    @GetMapping("/beverage-categories")
    public ResponseEntity<List<BeverageCategory>> getAllBeverageCategories() {
        return ResponseEntity.ok(menuService.getAllBeverageCategories());
    }

    @PostMapping("/beverage-categories")
    public ResponseEntity<BeverageCategory> createBeverageCategory(@RequestBody MenuDtos.BeverageCategoryRequestDto dto) {
        return new ResponseEntity<>(menuService.saveBeverageCategory(dto), HttpStatus.CREATED);
    }

    @PutMapping("/beverage-categories/{id}")
    public ResponseEntity<BeverageCategory> updateBeverageCategory(@PathVariable String id, @RequestBody MenuDtos.BeverageCategoryRequestDto dto) {
        return ResponseEntity.ok(menuService.updateBeverageCategory(id, dto));
    }

    @DeleteMapping("/beverage-categories/{id}")
    public ResponseEntity<Void> deleteBeverageCategory(@PathVariable String id) {
        menuService.deleteBeverageCategory(id);
        return ResponseEntity.noContent().build();
    }

    // --- BEBIDAS (MODIFICADO) ---
    @PostMapping("/beverages")
    public ResponseEntity<Beverage> createBeverage(@RequestBody MenuDtos.BeverageRequestDto beverageDto) {
        return new ResponseEntity<>(menuService.saveBeverage(beverageDto), HttpStatus.CREATED);
    }

    @PutMapping("/beverages/{id}")
    public ResponseEntity<Beverage> updateBeverage(@PathVariable String id, @RequestBody MenuDtos.BeverageRequestDto beverageDto) {
        return ResponseEntity.ok(menuService.updateBeverage(id, beverageDto));
    }

    @PostMapping("/beverages/{id}/image")
    public ResponseEntity<Beverage> uploadBeverageImage(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(menuService.saveBeverageImage(id, file));
    }

    // --- INÍCIO DA CORREÇÃO ---
    // Adicionando o endpoint que faltava para deletar uma bebida
    @DeleteMapping("/beverages/{id}")
    public ResponseEntity<Void> deleteBeverage(@PathVariable String id) {
        menuService.deleteBeverage(id);
        return ResponseEntity.noContent().build();
    }
    // --- FIM DA CORREÇÃO ---
}