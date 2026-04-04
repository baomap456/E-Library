package com.example.demo.mapper;

import org.springframework.stereotype.Component;

import com.example.demo.dto.AuthResponse;
import com.example.demo.model.Role;
import com.example.demo.model.User;

@Component
public class AuthMapper {

    public AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .roles(user.getRoles().stream().map(Role::getName).toList())
                .build();
    }
}
