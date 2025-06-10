package com.pizzadelivery.backend.dto;

public class DashboardDtos {
    public record Revenue(double today, double week, double month) {}
    public record DashboardStats(long todayOrders, long weeklyOrders, long monthlyOrders, long pendingOrders, Revenue revenue) {}
}
