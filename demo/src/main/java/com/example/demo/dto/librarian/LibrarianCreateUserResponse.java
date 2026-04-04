package com.example.demo.dto.librarian;

public record LibrarianCreateUserResponse(
        String message,
        Long userId,
        String username,
        String email,
        String membership) {
}
