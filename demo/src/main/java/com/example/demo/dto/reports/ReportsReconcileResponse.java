package com.example.demo.dto.reports;

public record ReportsReconcileResponse(
        String message,
        Long sessionId,
        String barcode,
        Integer actualQuantity) {
}
