package com.pizzadelivery.backend.repository;

import com.pizzadelivery.backend.dto.DashboardDtos;
import com.pizzadelivery.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Order> findByCustomerUser_IdOrderByCreatedAtDesc(String customerId);

    // CORREÇÃO: Usando a função CAST para compatibilidade máxima, incluindo H2.
    @Query("SELECT new com.pizzadelivery.backend.dto.DashboardDtos$DailySale(cast(o.createdAt as java.time.LocalDate), SUM(o.totalAmount)) " +
            "FROM Order o " +
            "WHERE o.createdAt >= :startDate " +
            "GROUP BY cast(o.createdAt as java.time.LocalDate) " +
            "ORDER BY cast(o.createdAt as java.time.LocalDate) ASC")
    List<DashboardDtos.DailySale> findRevenuePerDaySince(LocalDateTime startDate);


    // CORREÇÃO: Query corrigida para usar o DTO correto e a sintaxe correta.
    @Query("SELECT new com.pizzadelivery.backend.dto.DashboardDtos$SalesByPizzaType(item.pizzaType.name, COUNT(item)) " +
            "FROM Order o JOIN o.items item " +
            "GROUP BY item.pizzaType.name " +
            "ORDER BY COUNT(item) DESC")
    List<DashboardDtos.SalesByPizzaType> countOrdersByPizzaType();
}