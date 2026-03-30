package com.example.demo.service;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserContextService {

    private final UserRepository userRepository;

    public User resolveUser(String usernameOverride) {
        if (usernameOverride != null && !usernameOverride.isBlank()) {
            return userRepository.findByUsername(usernameOverride)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng: " + usernameOverride));
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)
                && authentication.getName() != null) {
            return userRepository.findByUsername(authentication.getName())
                    .orElseGet(this::fallbackUser);
        }

        return fallbackUser();
    }

    private User fallbackUser() {
        return userRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new IllegalArgumentException("Chưa có người dùng trong hệ thống"));
    }
}
