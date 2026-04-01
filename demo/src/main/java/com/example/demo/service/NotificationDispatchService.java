package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.dto.notification.NotificationItemResponse;
import com.example.demo.mapper.NotificationMapper;
import com.example.demo.model.Notification;
import com.example.demo.model.User;
import com.example.demo.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationDispatchService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final SimpMessagingTemplate messagingTemplate;
    private final JavaMailSender mailSender;

    @Value("${app.notification.email-enabled:false}")
    private boolean emailEnabled;

    @Value("${app.notification.email-from:}")
    private String emailFrom;

    public NotificationItemResponse createAndDispatch(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setRead(false);

        Notification saved = notificationRepository.save(notification);
        NotificationItemResponse payload = notificationMapper.toItemResponse(saved);

        messagingTemplate.convertAndSend("/topic/notifications/" + user.getId(), payload);
        sendEmailFallback(user, message);
        return payload;
    }

    private void sendEmailFallback(User user, String message) {
        if (!emailEnabled || user.getEmail() == null || user.getEmail().isBlank()) {
            return;
        }
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            if (emailFrom != null && !emailFrom.isBlank()) {
                mail.setFrom(emailFrom);
            }
            mail.setTo(user.getEmail());
            mail.setSubject("E-Library Notification");
            mail.setText(message);
            mailSender.send(mail);
        } catch (Exception ignored) {
            // Keep DB persistence + websocket delivery even when mail transport fails.
        }
    }
}
