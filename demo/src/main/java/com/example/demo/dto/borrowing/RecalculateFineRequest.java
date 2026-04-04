package com.example.demo.dto.borrowing;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record RecalculateFineRequest(
        @NotNull(message = "recordId không được để trống")
        @Positive(message = "recordId phải lớn hơn 0")
        Long recordId) {
}
