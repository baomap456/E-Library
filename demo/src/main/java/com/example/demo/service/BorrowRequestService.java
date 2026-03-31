package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.borrowing.ApproveBorrowRequestDto;
import com.example.demo.dto.borrowing.BorrowRequestResponse;
import com.example.demo.dto.borrowing.CreateBorrowRequestDto;

public interface BorrowRequestService {
    /**
     * User creates a borrow request for a specific book item
     */
    BorrowRequestResponse createBorrowRequest(CreateBorrowRequestDto request);

    /**
     * Get all pending borrow requests (for librarians to review)
     */
    List<BorrowRequestResponse> getPendingRequests();

    /**
     * Get all borrow requests (with pagination/filtering)
     */
    List<BorrowRequestResponse> getAllRequests();

    /**
     * Get user's own borrow requests history
     */
    List<BorrowRequestResponse> getMyRequests(String username);

    /**
     * Librarian approves or rejects a borrow request
     */
    BorrowRequestResponse processBorrowRequest(ApproveBorrowRequestDto dto);

    /**
     * User cancels their pending borrow request
     */
    BorrowRequestResponse cancelRequest(Long requestId);
}
