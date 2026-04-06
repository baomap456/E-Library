package com.example.demo.dto;

public record ForgotPasswordResponse(
        String message,
        String tempPassword) {
}
