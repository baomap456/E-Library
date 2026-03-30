package com.example.demo.mapper;

import java.util.Objects;

import org.springframework.stereotype.Component;

import com.example.demo.dto.borrowing.BorrowRecordResponse;
import com.example.demo.dto.borrowing.CartItemResponse;
import com.example.demo.dto.borrowing.PaidFineHistoryResponse;
import com.example.demo.model.Book;
import com.example.demo.model.BorrowRecord;
import com.example.demo.model.FinePayment;

@Component
public class BorrowingMapper {

    public CartItemResponse toCartItemResponse(Long bookId, Book book) {
        return new CartItemResponse(bookId, book == null ? "N/A" : book.getTitle());
    }

    public BorrowRecordResponse toBorrowRecordResponse(BorrowRecord record) {
        return new BorrowRecordResponse(
                record.getId(),
                record.getBookItem().getBook().getTitle(),
                record.getBookItem().getBarcode(),
                record.getBorrowDate(),
                record.getDueDate(),
                record.getReturnDate(),
                record.getStatus().name(),
                Objects.requireNonNullElse(record.getFineAmount(), 0.0));
    }

    public PaidFineHistoryResponse toPaidFineHistoryResponse(FinePayment payment, String fallbackMethod) {
        return new PaidFineHistoryResponse(
                payment.getId(),
                payment.getBorrowRecord().getId(),
                payment.getAmount(),
                payment.getPaymentDate(),
                payment.getPaymentMethod() == null ? fallbackMethod : payment.getPaymentMethod());
    }
}
