package com.example.demo.dto.borrow;

import com.example.demo.model.BorrowRequestStatus;

public record ApproveBorrowRequestRequest(
        Long borrowRequestId,
        BorrowRequestStatus action,
        String note) {
}
