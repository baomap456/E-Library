package com.example.demo.dto.reports;

import java.time.LocalDateTime;
import java.util.List;

public record ReportsDiscardBooksResponse(
        String message,
        List<String> discardedBarcodes,
        int discardedCount,
        Long reportId,
        String reportCode,
        LocalDateTime reportCreatedAt,
        List<ReportsDiscardReportItemResponse> reportItems) {
}
