package com.example.demo.dto.reports;

import java.time.LocalDateTime;

public record ReportsInventoryDetailResponse(
        String barcode,
        String title,
        String status,
        String locationLabel,
        LocalDateTime scannedAt) {
}
