package com.example.demo.dto.reports;

import java.time.LocalDateTime;

public record ReportsDiscardReportSummaryResponse(
        Long reportId,
        String reportCode,
        String reason,
        Integer discardedCount,
        LocalDateTime createdAt) {
}
