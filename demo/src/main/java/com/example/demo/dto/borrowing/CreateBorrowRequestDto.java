package com.example.demo.dto.borrowing;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record CreateBorrowRequestDto(
    String username,
    Long bookId,
    @NotNull(message = "Ngày lấy sách không được để trống")
    LocalDate requestedPickupDate,
    @NotNull(message = "Ngày trả dự kiến không được để trống")
    LocalDate requestedReturnDate
) {}
