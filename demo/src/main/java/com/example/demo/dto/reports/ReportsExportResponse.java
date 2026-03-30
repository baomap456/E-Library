package com.example.demo.dto.reports;

public record ReportsExportResponse(
        String message,
        String format,
        String downloadPath) {
}
