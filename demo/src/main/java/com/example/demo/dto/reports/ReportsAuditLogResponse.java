package com.example.demo.dto.reports;

import java.time.LocalDateTime;

public record ReportsAuditLogResponse(
        Long id,
        String actor,
        String action,
        String targetType,
        String targetId,
        String details,
        LocalDateTime createdAt) {
}
