package com.example.demo.dto.borrowing;

import java.time.LocalDateTime;

public record PaidFineHistoryResponse(
        Long paymentId,
        Long recordId,
        Double amount,
        LocalDateTime paidAt,
        String paymentMethod) {
}
