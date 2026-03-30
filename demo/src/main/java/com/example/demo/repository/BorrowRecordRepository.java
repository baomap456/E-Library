package com.example.demo.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.BorrowRecord;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByUserIdOrderByBorrowDateDesc(Long userId);

    List<BorrowRecord> findByReturnDateIsNull();

    Optional<BorrowRecord> findFirstByBookItemBarcodeAndReturnDateIsNull(String barcode);

    long countByBorrowDateBetween(LocalDateTime start, LocalDateTime end);
}
