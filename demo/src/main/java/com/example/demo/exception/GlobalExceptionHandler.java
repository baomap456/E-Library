package com.example.demo.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(
            BadCredentialsException ex,
            HttpServletRequest request) {
        return build(HttpStatus.UNAUTHORIZED, ex.getMessage(), request, Map.of());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request, Map.of());
    }

    @ExceptionHandler({ MethodArgumentNotValidException.class, BindException.class })
    public ResponseEntity<ApiErrorResponse> handleValidationErrors(
            Exception ex,
            HttpServletRequest request) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        switch (ex) {
        case MethodArgumentNotValidException manv -> {
            for (FieldError fieldError : manv.getBindingResult().getFieldErrors()) {
                fieldErrors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
            }
        }
        case BindException be -> {
            for (FieldError fieldError : be.getBindingResult().getFieldErrors()) {
                fieldErrors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
            }
        }
        default -> {
        }
        }

        String message = fieldErrors.isEmpty()
                ? "Dữ liệu gửi lên không hợp lệ"
                : "Vui lòng kiểm tra lại dữ liệu đầu vào";
        return build(HttpStatus.BAD_REQUEST, message, request, fieldErrors);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodValidation(
            HandlerMethodValidationException ex,
            HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, "Dữ liệu gửi lên không hợp lệ", request, Map.of());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex,
            HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, "Dữ liệu gửi lên không hợp lệ", request, Map.of());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request) {
        return build(HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện thao tác này", request, Map.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnhandled(
            Exception ex,
            HttpServletRequest request) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Hệ thống gặp sự cố, vui lòng thử lại sau", request, Map.of());
    }

    private ResponseEntity<ApiErrorResponse> build(
            HttpStatus status,
            String message,
            HttpServletRequest request,
            Map<String, String> fieldErrors) {
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now().toString(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI(),
                fieldErrors);
        return ResponseEntity.status(status).body(body);
    }
}
