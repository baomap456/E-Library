package com.example.demo.dto.reports;

public record ReportsCategoryShareResponse(
        String category,
        double percentage,
        long bookCount) {
}
