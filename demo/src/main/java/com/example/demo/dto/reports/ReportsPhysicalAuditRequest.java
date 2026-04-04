package com.example.demo.dto.reports;

import jakarta.validation.constraints.NotBlank;

public record ReportsPhysicalAuditRequest(
        @NotBlank(message = "barcode không được để trống")
        String barcode,
        @NotBlank(message = "observedState không được để trống")
        String observedState,
        String note) {
}
