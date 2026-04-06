package com.example.demo.dto.borrowing;

import java.time.LocalDateTime;

public record BorrowRecordResponse(
        Long recordId,
        Long userId,
        String username,
        String userFullName,
        Long bookId,
        Long bookItemId,
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
        Long daysUntilDue,
        String borrowMode,
        Double depositAmount,
        String borrowerCitizenId,
        Boolean temporaryRecord,
        String incidentType,
        String damageSeverity,
        Double compensationAmount,
        String incidentNote) {
}
