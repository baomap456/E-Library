package com.example.demo.dto.librarian;

import java.time.LocalDateTime;

public record LibrarianFineInvoiceResponse(
        Long paymentId,
        Long recordId,
        String username,
        String fullName,
        String bookTitle,
        Double amount,
        LocalDateTime paymentDate,
        String paymentMethod) {
}