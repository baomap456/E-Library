package com.example.demo.mapper;

import java.util.Objects;

import org.springframework.stereotype.Component;

import com.example.demo.dto.borrowing.BorrowRecordResponse;
import com.example.demo.dto.borrowing.BorrowRequestResponse;
import com.example.demo.dto.borrowing.CartItemResponse;
import com.example.demo.dto.borrowing.PaidFineHistoryResponse;
import com.example.demo.model.Book;
import com.example.demo.model.BorrowRecord;
import com.example.demo.model.BorrowRequest;
import com.example.demo.model.FinePayment;

@Component
public class BorrowingMapper {

    public CartItemResponse toCartItemResponse(Long bookId, Book book) {
        return new CartItemResponse(bookId, book == null ? "N/A" : book.getTitle());
    }

    public BorrowRecordResponse toBorrowRecordResponse(
            BorrowRecord record,
            int maxRenewals,
            boolean canRenew,
            String renewDisabledReason,
            Long daysUntilDue) {
        return new BorrowRecordResponse(
                record.getId(),
                record.getBookItem().getBook().getTitle(),
                record.getBookItem().getBarcode(),
                record.getBorrowDate(),
                record.getDueDate(),
                record.getReturnDate(),
                record.getStatus().name(),
                Objects.requireNonNullElse(record.getFineAmount(), 0.0),
                Objects.requireNonNullElse(record.getRenewalCount(), 0),
                maxRenewals,
                canRenew,
                renewDisabledReason,
                daysUntilDue);
    }

    public PaidFineHistoryResponse toPaidFineHistoryResponse(FinePayment payment, String fallbackMethod) {
        return new PaidFineHistoryResponse(
                payment.getId(),
                payment.getBorrowRecord().getId(),
                payment.getAmount(),
                payment.getPaymentDate(),
                payment.getPaymentMethod() == null ? fallbackMethod : payment.getPaymentMethod());
    }

    public BorrowRequestResponse toBorrowRequestResponse(BorrowRequest request) {
        return new BorrowRequestResponse(
                request.getId(),
                request.getUser().getId(),
                request.getUser().getUsername(),
                request.getUser().getFullName(),
            request.getBookItem().getBook().getId(),
                request.getBookItem().getId(),
                request.getBookItem().getBook().getTitle(),
                request.getBookItem().getBook().getIsbn(),
                request.getRequestDate(),
                request.getRequestedPickupDate(),
                request.getRequestedReturnDate(),
                request.getApprovalDate(),
                request.getApprovalNote(),
                request.getApprovedBy() == null ? null : request.getApprovedBy().getUsername(),
                request.getStatus());
    }
}
