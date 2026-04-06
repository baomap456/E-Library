package com.example.demo.dto.reports;

public record ReportsDiscardReportItemResponse(
        String barcode,
        String title,
        String previousStatus,
        String currentStatus,
        String criteriaCode) {
}
