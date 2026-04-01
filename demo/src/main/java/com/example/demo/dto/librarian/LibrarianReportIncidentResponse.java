package com.example.demo.dto.librarian;

public record LibrarianReportIncidentResponse(
        String message,
        Long recordId,
        String incidentType,
        String bookStatus,
        Double compensationAmount,
        Double deductedFromDeposit,
        Double remainingDebt,
        boolean borrowingLocked) {
}
