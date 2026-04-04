package com.example.demo.dto.borrowing;

import java.time.LocalDateTime;

public record BorrowRecordResponse(
        Long recordId,
        String bookTitle,
        String barcode,
        LocalDateTime borrowDate,
        LocalDateTime dueDate,
        LocalDateTime returnDate,
        String status,
        Double fineAmount,
        Integer renewalCount,
        Integer maxRenewals,
        Boolean canRenew,
        String renewDisabledReason,
        Long daysUntilDue) {
}
