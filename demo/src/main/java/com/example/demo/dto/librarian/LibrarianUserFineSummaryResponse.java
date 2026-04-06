package com.example.demo.dto.librarian;

public record LibrarianUserFineSummaryResponse(
        Long userId,
        String username,
        String fullName,
        Double totalPaidAmount,
        Double outstandingDebt,
        Long paymentCount,
        Boolean borrowingLocked) {
}