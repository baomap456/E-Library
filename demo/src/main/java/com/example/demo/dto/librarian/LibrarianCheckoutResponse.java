package com.example.demo.dto.librarian;

import java.time.LocalDateTime;

public record LibrarianCheckoutResponse(
        String message,
        Long recordId,
        LocalDateTime dueDate) {
}
