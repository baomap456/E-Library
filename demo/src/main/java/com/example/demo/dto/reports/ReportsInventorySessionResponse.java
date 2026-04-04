package com.example.demo.dto.reports;

import java.time.LocalDateTime;

public record ReportsInventorySessionResponse(
        Long id,
        String name,
        String area,
        String status,
        LocalDateTime createdAt) {
}
