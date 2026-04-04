package com.example.demo.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dto.notification.MarkReadResponse;
import com.example.demo.dto.notification.NotificationItemResponse;
import com.example.demo.mapper.NotificationMapper;
import com.example.demo.model.Notification;
import com.example.demo.model.User;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.service.NotificationService;
import com.example.demo.service.UserContextService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserContextService userContextService;
    private final NotificationMapper notificationMapper;

    @Override
    public List<NotificationItemResponse> list(String username) {
        User user = userContextService.resolveUser(username);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
            .map(notificationMapper::toItemResponse)
                .toList();
    }

    @Override
    public MarkReadResponse markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông báo"));
        notification.setRead(true);
        notificationRepository.save(notification);
        return new MarkReadResponse("Đã đánh dấu đã đọc", id);
    }
}
