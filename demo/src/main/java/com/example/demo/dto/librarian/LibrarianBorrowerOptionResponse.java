package com.example.demo.dto.librarian;

public record LibrarianBorrowerOptionResponse(
        Long userId,
        String username,
        String fullName,
        String email,
        String phone,
        String studentId,
        String membershipName) {
}
