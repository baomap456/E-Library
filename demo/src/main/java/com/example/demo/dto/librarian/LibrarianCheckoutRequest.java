package com.example.demo.dto.librarian;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LibrarianCheckoutRequest(
        @NotBlank(message = "username không được để trống")
        @Size(max = 50, message = "username tối đa 50 ký tự")
        String username,
        @NotBlank(message = "barcode không được để trống")
        @Size(max = 100, message = "barcode tối đa 100 ký tự")
        String barcode) {
}
