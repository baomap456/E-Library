package com.example.demo.dto.librarian;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LibrarianIncidentRequest(
        @NotBlank(message = "detail không được để trống")
        @Size(max = 2000, message = "detail tối đa 2000 ký tự")
        String detail) {
}
