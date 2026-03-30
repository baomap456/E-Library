package com.example.demo.dto.librarian;

public record LibrarianCheckinResponse(
        String message,
        Long recordId,
        Double fineAmount) {
}
