package com.example.demo.dto.borrowing;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record PayFineRequest(
        @NotNull(message = "recordId không được để trống")
        @Positive(message = "recordId phải lớn hơn 0")
        Long recordId,
        @Size(max = 30, message = "paymentMethod tối đa 30 ký tự")
        String paymentMethod) {
}
