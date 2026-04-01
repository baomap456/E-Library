package com.example.demo.dto.librarian;

import java.time.LocalDateTime;

public record LibrarianDebtorResponse(
        Long recordId,
        String username,
        String bookTitle,
        Double fineAmount,
        LocalDateTime dueDate,
        Double outstandingDebt,
        Boolean borrowingLocked,
        Long overdueDays,
        Boolean overdue) {
}
