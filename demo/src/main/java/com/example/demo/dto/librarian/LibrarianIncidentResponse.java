package com.example.demo.dto.librarian;

import java.time.LocalDateTime;

public record LibrarianIncidentResponse(
        Long id,
        String detail,
        LocalDateTime createdAt) {
}
