package com.example.demo.dto.profile;

public record LibraryCardResponse(
        String cardCode,
        String qrPayload,
        String validUntil) {
}
