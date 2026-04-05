package com.example.demo.dto.librarian;

import java.time.LocalDateTime;

public record LibrarianMembershipInvoiceResponse(
        Long transactionId,
        String username,
        String fullName,
        String actorUsername,
        String paymentChannel,
        String action,
        String fromPackage,
        String toPackage,
        Double amount,
        String note,
        LocalDateTime createdAt) {
}