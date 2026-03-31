package com.example.demo.dto.borrowing;

public record ApproveBorrowRequestDto(
    Long requestId,
    Boolean approve,
    String note
) {}
