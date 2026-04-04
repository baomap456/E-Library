package com.example.demo.dto.reports;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ReportsReconcileRequest(
        @NotNull(message = "sessionId không được để trống")
        @Positive(message = "sessionId phải lớn hơn 0")
        Long sessionId,
        @NotBlank(message = "barcode không được để trống")
        @Size(max = 100, message = "barcode tối đa 100 ký tự")
        String barcode,
        @NotNull(message = "actualQuantity không được để trống")
        @Positive(message = "actualQuantity phải lớn hơn 0")
        Integer actualQuantity) {
}
