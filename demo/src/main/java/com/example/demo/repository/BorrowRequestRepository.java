package com.example.demo.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.BorrowRequest;
import com.example.demo.model.BorrowRequestStatus;
import com.example.demo.model.BorrowRequestType;

public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {
    List<BorrowRequest> findByUserIdOrderByRequestDateDesc(Long userId);
    
    List<BorrowRequest> findByStatusOrderByRequestDateDesc(BorrowRequestStatus status);
    
    List<BorrowRequest> findByStatusAndUserIdOrderByRequestDateDesc(BorrowRequestStatus status, Long userId);

    long countByStatusAndBookItemBookId(BorrowRequestStatus status, Long bookId);

    boolean existsByStatusAndUserIdAndBookItemBookId(BorrowRequestStatus status, Long userId, Long bookId);

    boolean existsByStatusInAndUserIdAndBookItemBookId(Collection<BorrowRequestStatus> statuses, Long userId, Long bookId);

    boolean existsByStatusAndBookItemId(BorrowRequestStatus status, Long bookItemId);

    long countByStatusAndUserId(BorrowRequestStatus status, Long userId);

    List<BorrowRequest> findByStatusAndRequestedPickupDateBefore(BorrowRequestStatus status, LocalDate date);

        boolean existsByStatusAndRequestTypeAndBorrowRecordId(BorrowRequestStatus status, BorrowRequestType requestType, Long borrowRecordId);

        long countByUserIdAndRequestTypeAndStatusInAndRequestDateBetween(
            Long userId,
            BorrowRequestType requestType,
            Collection<BorrowRequestStatus> statuses,
            LocalDateTime start,
            LocalDateTime end);

        long countByUserIdAndRequestTypeAndStatusAndRequestDateBetween(
            Long userId,
            BorrowRequestType requestType,
            BorrowRequestStatus status,
            LocalDateTime start,
            LocalDateTime end);
}
