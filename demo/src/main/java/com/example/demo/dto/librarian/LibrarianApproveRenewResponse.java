package com.example.demo.dto.librarian;

import java.time.LocalDateTime;

public record LibrarianApproveRenewResponse(
        String message,
        LocalDateTime newDueDate) {
}
