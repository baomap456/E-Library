package com.example.demo.service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.Map;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.example.demo.dto.notification.NotificationItemResponse;
import com.example.demo.mapper.NotificationMapper;
import com.example.demo.model.Notification;
import com.example.demo.model.User;
import com.example.demo.repository.NotificationRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationDispatchService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final SpringTemplateEngine templateEngine;

    @Value("${app.notification.email-enabled:false}")
    private boolean emailEnabled;

    @Value("${app.notification.email-from:}")
    private String emailFrom;

    @Value("${app.notification.frontend-base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    public NotificationItemResponse createAndDispatch(User user, String message) {
        return createAndDispatch(user, message, "mail/notification", Map.of());
        }

        public NotificationItemResponse createAndDispatch(
            User user,
            String message,
            String emailTemplateName,
            Map<String, Object> templateVariables) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setRead(false);

        Notification saved = notificationRepository.save(notification);
        NotificationItemResponse payload = notificationMapper.toItemResponse(saved);

        messagingTemplate.convertAndSend("/topic/notifications/" + user.getId(), payload);
        sendEmailFallback(user, message, emailTemplateName, templateVariables);
        return payload;
    }

    private void sendEmailFallback(User user, String message, String emailTemplateName, Map<String, Object> templateVariables) {
        if (!emailEnabled || user.getEmail() == null || user.getEmail().isBlank() || !isEmailRecipient(user)) {
            return;
        }
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            return;
        }
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, StandardCharsets.UTF_8.name());
            if (emailFrom != null && !emailFrom.isBlank()) {
                helper.setFrom(emailFrom);
            }
            helper.setTo(user.getEmail());
            helper.setSubject("E-Library Notification");
            helper.setText(buildHtmlEmail(user, message, emailTemplateName, templateVariables), true);
            mailSender.send(mimeMessage);
        } catch (MessagingException ignored) {
            // Keep DB persistence + websocket delivery even when mail transport fails.
        }
    }

    private boolean isEmailRecipient(User user) {
        return user.getRoles().stream()
                .map(role -> role.getName())
                .anyMatch(roleName -> "ROLE_MEMBER".equals(roleName) || "ROLE_GUEST".equals(roleName));
    }

    private String buildHtmlEmail(User user, String message, String emailTemplateName, Map<String, Object> templateVariables) {
        Context context = new Context();
        context.setVariable("recipientName", user.getFullName() != null && !user.getFullName().isBlank()
                ? user.getFullName()
                : user.getUsername());
        context.setVariable("message", message);
        context.setVariable("currentYear", Year.now().getValue());
        context.setVariable("frontendBaseUrl", frontendBaseUrl);
        context.setVariable("generatedAt", LocalDateTime.now());
        if (templateVariables != null && !templateVariables.isEmpty()) {
            context.setVariables(templateVariables);
        }
        return templateEngine.process(emailTemplateName, context);
    }
}
