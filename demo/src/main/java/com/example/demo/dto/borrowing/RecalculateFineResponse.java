package com.example.demo.dto.borrowing;

public record RecalculateFineResponse(
        Long recordId,
        Double fineAmount) {
}
