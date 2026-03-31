package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.borrowing.AddCartItemRequest;
import com.example.demo.dto.borrowing.BorrowRecordResponse;
import com.example.demo.dto.borrowing.CartItemActionResponse;
import com.example.demo.dto.borrowing.CartItemResponse;
import com.example.demo.dto.borrowing.FinePaymentResponse;
import com.example.demo.dto.borrowing.FinesResponse;
import com.example.demo.dto.borrowing.PayFineRequest;
import com.example.demo.dto.borrowing.RecalculateFineRequest;
import com.example.demo.dto.borrowing.RecalculateFineResponse;
import com.example.demo.dto.borrowing.RenewRecordResponse;
import com.example.demo.dto.borrowing.WaitlistItemResponse;
import com.example.demo.dto.borrowing.WaitlistRequest;
import com.example.demo.dto.borrowing.WaitlistResponse;
import com.example.demo.service.BorrowingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/borrowing")
@RequiredArgsConstructor
public class BorrowingController {

    private final BorrowingService borrowingService;

    @GetMapping("/cart")
    public ResponseEntity<List<CartItemResponse>> cart(@RequestParam(required = false) String username) {
        return ResponseEntity.ok(borrowingService.getCart(username));
    }

    @PostMapping("/cart/items")
    public ResponseEntity<CartItemActionResponse> addCartItem(@Valid @RequestBody AddCartItemRequest request) {
        return ResponseEntity.ok(borrowingService.addCartItem(request));
    }

    @DeleteMapping("/cart/items/{bookId}")
    public ResponseEntity<CartItemActionResponse> removeCartItem(
            @PathVariable Long bookId,
            @RequestParam(required = false) String username) {
        return ResponseEntity.ok(borrowingService.removeCartItem(bookId, username));
    }

    @GetMapping("/records")
    public ResponseEntity<List<BorrowRecordResponse>> records(@RequestParam(required = false) String username) {
        return ResponseEntity.ok(borrowingService.getRecords(username));
    }

    @GetMapping("/waitlist/me")
    public ResponseEntity<List<WaitlistItemResponse>> myWaitlist(@RequestParam(required = false) String username) {
        return ResponseEntity.ok(borrowingService.getMyWaitlist(username));
    }

    @PatchMapping("/records/{recordId}/renew")
    public ResponseEntity<RenewRecordResponse> renew(@PathVariable Long recordId) {
        return ResponseEntity.ok(borrowingService.renew(recordId));
    }

    @PostMapping("/waitlist")
    public ResponseEntity<WaitlistResponse> waitlist(@Valid @RequestBody WaitlistRequest request) {
        return ResponseEntity.ok(borrowingService.joinWaitlist(request));
    }

    @GetMapping("/fines")
    public ResponseEntity<FinesResponse> fines(@RequestParam(required = false) String username) {
        return ResponseEntity.ok(borrowingService.getFines(username));
    }

    @PostMapping("/fines/pay")
    public ResponseEntity<FinePaymentResponse> payFine(@Valid @RequestBody PayFineRequest request) {
        return ResponseEntity.ok(borrowingService.payFine(request));
    }

    @PostMapping("/fines/recalculate")
    public ResponseEntity<RecalculateFineResponse> recalculateFine(@Valid @RequestBody RecalculateFineRequest request) {
        return ResponseEntity.ok(borrowingService.recalculateFine(request));
    }
}
