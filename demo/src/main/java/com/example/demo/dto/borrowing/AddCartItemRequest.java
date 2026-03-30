package com.example.demo.dto.borrowing;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record AddCartItemRequest(
        @Size(max = 50, message = "username tối đa 50 ký tự")
        String username,
        @NotNull(message = "bookId không được để trống")
        @Positive(message = "bookId phải lớn hơn 0")
        Long bookId) {
}
