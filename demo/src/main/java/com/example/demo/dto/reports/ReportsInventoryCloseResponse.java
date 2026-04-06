package com.example.demo.dto.reports;

import java.util.List;

public record ReportsInventoryCloseResponse(
        Long sessionId,
        String status,
        int scannedCount,
        int matchedCount,
        int missingCount,
        int conflictCount,
        List<String> missingBarcodes,
        List<ReportsInventoryConflictItemResponse> conflicts,
        String message) {
}
