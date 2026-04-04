package com.example.demo.dto.reports;

public record ReportsMonthlyUserGrowthResponse(
        String month,
        long newUsers) {
}
