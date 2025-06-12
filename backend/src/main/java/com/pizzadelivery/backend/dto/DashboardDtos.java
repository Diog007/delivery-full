package com.pizzadelivery.backend.dto;

import java.time.LocalDate;

public class DashboardDtos {
    public record Revenue(double today, double week, double month) {}
    public record DashboardStats(long todayOrders, long weeklyOrders, long monthlyOrders, long pendingOrders, Revenue revenue) {}

    // --- ADICIONE OS DOIS RECORDS ABAIXO ---

    /**
     * DTO para representar a receita de um dia específico para o gráfico de vendas.
     * @param date A data (ex: "2024-06-11")
     * @param revenue A receita total para essa data.
     */
    public record DailySale(LocalDate date, double revenue) {}

    /**
     * DTO para representar a contagem de vendas por tipo de pizza.
     * @param pizzaTypeName O nome do tipo da pizza (ex: "Pizza Grande")
     * @param count A quantidade de vezes que foi pedida.
     */
    public record SalesByPizzaType(String pizzaTypeName, long count) {}
}