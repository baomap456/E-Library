package com.example.demo.dto.reports;

public record ReportsDiscrepancyResponse(
        String title,
        Long systemCount,
        Long actualCount,
        Integer difference) {
}
