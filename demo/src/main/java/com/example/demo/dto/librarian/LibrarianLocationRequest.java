package com.example.demo.dto.librarian;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LibrarianLocationRequest(
        @NotBlank(message = "roomName không được để trống")
        @Size(max = 100, message = "roomName tối đa 100 ký tự")
        String roomName,
        @NotBlank(message = "shelfNumber không được để trống")
        @Size(max = 100, message = "shelfNumber tối đa 100 ký tự")
        String shelfNumber) {
}
