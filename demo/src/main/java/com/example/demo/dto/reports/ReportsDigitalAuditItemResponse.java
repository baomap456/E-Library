package com.example.demo.dto.reports;

public record ReportsDigitalAuditItemResponse(
        Long bookId,
        String title,
        String fileUrl,
        boolean healthy,
        String detail) {
}
