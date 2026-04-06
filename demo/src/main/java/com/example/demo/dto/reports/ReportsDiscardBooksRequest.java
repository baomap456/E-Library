package com.example.demo.dto.reports;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;

public record ReportsDiscardBooksRequest(
        @NotEmpty(message = "barcodes không được để trống")
        List<String> barcodes,
        String reason) {
}
