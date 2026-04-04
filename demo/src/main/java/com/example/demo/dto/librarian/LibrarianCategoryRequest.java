package com.example.demo.dto.librarian;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LibrarianCategoryRequest(
        @NotBlank(message = "name không được để trống")
        @Size(max = 255, message = "name tối đa 255 ký tự")
        String name) {
}
