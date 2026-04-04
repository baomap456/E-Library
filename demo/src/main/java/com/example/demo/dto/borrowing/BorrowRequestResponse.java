package com.example.demo.dto.borrowing;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.demo.model.BorrowRequestStatus;

public record BorrowRequestResponse(
    Long id,
    Long userId,
    String username,
    String userFullName,
    Long bookId,
    Long bookItemId,
    String bookTitle,
    String isbn,
    LocalDateTime requestDate,
    LocalDate requestedPickupDate,
    LocalDate requestedReturnDate,
    LocalDateTime approvalDate,
    String approvalNote,
    String approvedByUsername,
    BorrowRequestStatus status
) {}
