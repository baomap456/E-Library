package com.example.demo.dto.profile;

import java.time.LocalDateTime;

public record MembershipTransactionResponse(
        Long id,
        String actorUsername,
        String paymentChannel,
        String action,
        String fromPackage,
        String toPackage,
        Double amount,
        String note,
        LocalDateTime createdAt) {
}
