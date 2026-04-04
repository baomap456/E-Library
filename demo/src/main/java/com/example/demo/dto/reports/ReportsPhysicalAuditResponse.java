package com.example.demo.dto.reports;

public record ReportsPhysicalAuditResponse(
        String barcode,
        String systemStatus,
        String observedState,
        String result,
        String message) {
}
