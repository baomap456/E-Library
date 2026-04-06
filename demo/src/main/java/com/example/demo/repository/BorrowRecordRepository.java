package com.example.demo.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.BorrowRecord;
import com.example.demo.model.BookStatus;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByUserIdOrderByBorrowDateDesc(Long userId);

    List<BorrowRecord> findByReturnDateIsNull();

    Optional<BorrowRecord> findFirstByBookItemBarcodeAndReturnDateIsNull(String barcode);

    boolean existsByUserIdAndBookItemBookIdAndReturnDateIsNull(Long userId, Long bookId);

    long countByUserIdAndReturnDateIsNull(Long userId);

    long countByBorrowDateBetween(LocalDateTime start, LocalDateTime end);

    long countByBookItemId(Long bookItemId);

    Optional<BorrowRecord> findFirstByBookItemIdOrderByBorrowDateDesc(Long bookItemId);

    List<BorrowRecord> findByReturnDateIsNullAndBorrowModeAndDueDateBefore(String borrowMode, LocalDateTime dueDate);

    List<BorrowRecord> findByReturnDateIsNullAndStatusInAndDueDateBefore(Collection<BookStatus> statuses, LocalDateTime dueDate);

    @Query("select coalesce(sum(br.fineAmount), 0) from BorrowRecord br where br.user.id = :userId and br.fineAmount > 0")
    Double sumOutstandingDebtByUserId(@Param("userId") Long userId);
}
