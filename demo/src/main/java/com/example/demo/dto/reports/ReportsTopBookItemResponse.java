package com.example.demo.dto.reports;

public record ReportsTopBookItemResponse(
        Long bookId,
        String title,
        long borrowCount) {
}
