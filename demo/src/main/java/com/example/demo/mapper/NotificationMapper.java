package com.example.demo.mapper;

import org.springframework.stereotype.Component;

import com.example.demo.dto.notification.NotificationItemResponse;
import com.example.demo.model.Notification;

@Component
public class NotificationMapper {

    public NotificationItemResponse toItemResponse(Notification notification) {
        return new NotificationItemResponse(
                notification.getId(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt());
    }
}
