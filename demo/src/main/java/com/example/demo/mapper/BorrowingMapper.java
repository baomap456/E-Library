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
            record.getUser() == null ? null : record.getUser().getId(),
            record.getUser() == null ? null : record.getUser().getUsername(),
            record.getUser() == null ? null : record.getUser().getFullName(),
            record.getBookItem() == null || record.getBookItem().getBook() == null ? null : record.getBookItem().getBook().getId(),
            record.getBookItem() == null ? null : record.getBookItem().getId(),
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
            daysUntilDue,
            record.getBorrowMode(),
            Objects.requireNonNullElse(record.getDepositAmount(), 0.0),
            record.getBorrowerCitizenId(),
            record.getTemporaryRecord(),
            record.getIncidentType(),
            record.getDamageSeverity(),
            Objects.requireNonNullElse(record.getCompensationAmount(), 0.0),
            record.getIncidentNote());
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
        Book book = request.getBookItem() != null
                ? request.getBookItem().getBook()
                : request.getBorrowRecord() != null && request.getBorrowRecord().getBookItem() != null
                    ? request.getBorrowRecord().getBookItem().getBook()
                    : null;
        String source = "REQUEST";
        if (request.getRequestType() == com.example.demo.model.BorrowRequestType.BORROW
                && request.getBorrowRecord() != null
                && "Lập phiếu mượn trực tiếp tại quầy".equals(request.getApprovalNote())) {
            source = "DESK";
        }

        return new BorrowRequestResponse(
                request.getId(),
                request.getUser().getId(),
                request.getBorrowRecord() == null ? null : request.getBorrowRecord().getId(),
                request.getUser().getUsername(),
                request.getUser().getFullName(),
                book == null ? null : book.getId(),
                request.getBookItem() == null ? null : request.getBookItem().getId(),
                book == null ? null : book.getTitle(),
                book == null ? null : book.getIsbn(),
                request.getRequestDate(),
                request.getRequestedPickupDate(),
                request.getRequestedReturnDate(),
                request.getApprovalDate(),
                request.getApprovalNote(),
                request.getApprovedBy() == null ? null : request.getApprovedBy().getUsername(),
                request.getStatus(),
                request.getRequestType(),
                source);
    }
}
