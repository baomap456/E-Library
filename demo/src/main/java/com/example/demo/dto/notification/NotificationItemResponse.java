package com.example.demo.dto.notification;

import java.time.LocalDateTime;

public record NotificationItemResponse(
        Long id,
        String message,
        Boolean read,
        LocalDateTime createdAt) {
}
