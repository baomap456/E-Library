package com.example.demo.dto.borrowing;

public record FinePaymentQrResponse(
        String qrPayload,
        Double amount,
        String paymentReference,
        String paymentMethod) {
}
