package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.borrowing.ApproveBorrowRequestDto;
import com.example.demo.dto.borrowing.BorrowRequestResponse;
import com.example.demo.dto.borrowing.CreateBorrowRequestDto;
import com.example.demo.service.BorrowRequestService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/borrow-requests")
@RequiredArgsConstructor
public class BorrowRequestController {

    private final BorrowRequestService borrowRequestService;

    /**
     * User creates a borrow request
     */
    @PostMapping("/create")
    public ResponseEntity<BorrowRequestResponse> createBorrowRequest(@Valid @RequestBody CreateBorrowRequestDto request) {
        return ResponseEntity.ok(borrowRequestService.createBorrowRequest(request));
    }

    /**
     * Get all pending requests (librarian only)
     */
    @GetMapping("/pending")
    public ResponseEntity<List<BorrowRequestResponse>> getPendingRequests() {
        return ResponseEntity.ok(borrowRequestService.getPendingRequests());
    }

    /**
     * Get all requests (librarian only)
     */
    @GetMapping("/all")
    public ResponseEntity<List<BorrowRequestResponse>> getAllRequests() {
        return ResponseEntity.ok(borrowRequestService.getAllRequests());
    }

    /**
     * Get user's own requests
     */
    @GetMapping("/my-requests")
    public ResponseEntity<List<BorrowRequestResponse>> getMyRequests(String username) {
        return ResponseEntity.ok(borrowRequestService.getMyRequests(username));
    }

    /**
     * Librarian approves or rejects a request
     */
    @PostMapping("/approve")
    public ResponseEntity<BorrowRequestResponse> approveBorrowRequest(@RequestBody ApproveBorrowRequestDto dto) {
        return ResponseEntity.ok(borrowRequestService.processBorrowRequest(dto));
    }

    /**
     * User cancels their pending request
     */
    @DeleteMapping("/{requestId}")
    public ResponseEntity<BorrowRequestResponse> cancelRequest(@PathVariable Long requestId) {
        return ResponseEntity.ok(borrowRequestService.cancelRequest(requestId));
    }
}
