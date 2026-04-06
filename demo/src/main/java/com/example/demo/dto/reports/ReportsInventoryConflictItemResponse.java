package com.example.demo.dto.reports;

public record ReportsInventoryConflictItemResponse(
        String barcode,
        String type,
        String message,
        boolean resolved) {
}
