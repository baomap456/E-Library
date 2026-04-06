package com.example.demo.dto.reports;

import java.time.LocalDateTime;
import java.util.List;

public record ReportsDiscardReportDetailResponse(
        Long reportId,
        String reportCode,
        String reason,
        Integer discardedCount,
        LocalDateTime createdAt,
        List<ReportsDiscardReportItemResponse> items) {
}
