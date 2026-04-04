package com.example.demo.dto.librarian;

import java.time.LocalDateTime;

public record LibrarianRenewalRequestResponse(
        Long recordId,
        String username,
        String bookTitle,
        LocalDateTime dueDate,
        String status) {
}
