package com.example.demo.dto.borrowing;

public record WaitlistResponse(
        String message,
        Long bookId,
        Integer position) {
}
