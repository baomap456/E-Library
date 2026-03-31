package com.example.demo.dto.borrowing;

public record WaitlistItemResponse(
        Long bookId,
        String title,
        Integer position) {
}
