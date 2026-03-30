package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.notification.MarkReadResponse;
import com.example.demo.dto.notification.NotificationItemResponse;

public interface NotificationService {
    List<NotificationItemResponse> list(String username);

    MarkReadResponse markAsRead(Long id);
}
