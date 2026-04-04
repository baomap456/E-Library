package com.example.demo.dto.borrowing;

public record WaitlistItemResponse(
        Long reservationId,
        Long bookId,
        String title,
        Integer position,
        String status,
        java.time.LocalDateTime expiryDate) {
}
