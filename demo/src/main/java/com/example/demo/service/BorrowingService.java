package com.example.demo.service;

import java.util.List;

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

public interface BorrowingService {
    List<CartItemResponse> getCart(String username);

    CartItemActionResponse addCartItem(AddCartItemRequest request);

    CartItemActionResponse removeCartItem(Long bookId, String username);

    List<BorrowRecordResponse> getRecords(String username);

    List<WaitlistItemResponse> getMyWaitlist(String username);

    RenewRecordResponse renew(Long recordId);

    WaitlistResponse joinWaitlist(WaitlistRequest request);

    FinesResponse getFines(String username);

    FinePaymentResponse payFine(PayFineRequest request);

    RecalculateFineResponse recalculateFine(RecalculateFineRequest request);
}
