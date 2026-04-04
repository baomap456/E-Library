package com.example.demo.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.FinePayment;

public interface FinePaymentRepository extends JpaRepository<FinePayment, Long> {
    List<FinePayment> findByBorrowRecordUserIdOrderByPaymentDateDesc(Long userId);

    List<FinePayment> findByPaymentDateBetween(LocalDateTime from, LocalDateTime to);
}
