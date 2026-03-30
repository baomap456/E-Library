package com.example.demo.dto.borrowing;

import java.time.LocalDateTime;

public record RenewRecordResponse(
        String message,
        LocalDateTime newDueDate) {
}
