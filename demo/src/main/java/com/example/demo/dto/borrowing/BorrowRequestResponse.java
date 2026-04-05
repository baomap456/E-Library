package com.example.demo.dto.borrowing;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.demo.model.BorrowRequestStatus;
import com.example.demo.model.BorrowRequestType;

public record BorrowRequestResponse(
    Long id,
    Long userId,
    Long borrowRecordId,
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
    BorrowRequestStatus status,
    BorrowRequestType requestType,
    String source
) {}
