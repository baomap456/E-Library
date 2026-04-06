package com.example.demo.service;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.ForgotPasswordRequest;
import com.example.demo.dto.ForgotPasswordResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
public interface AuthService {
    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request);
}
