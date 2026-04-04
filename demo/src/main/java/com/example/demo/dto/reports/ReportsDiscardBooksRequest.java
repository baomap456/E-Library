package com.example.demo.dto.reports;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;

public record ReportsDiscardBooksRequest(
        @NotEmpty(message = "bookIds không được để trống")
        List<Long> bookIds,
        String reason) {
}
