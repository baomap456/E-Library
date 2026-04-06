package com.example.demo.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Reservation;
import com.example.demo.model.ReservationStatus;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserIdAndStatusInOrderByCreatedAtDesc(Long userId, Collection<ReservationStatus> statuses);

    List<Reservation> findByBookIdAndStatusOrderByCreatedAtAsc(Long bookId, ReservationStatus status);

    long countByUserIdAndStatusIn(Long userId, Collection<ReservationStatus> statuses);

    long countByBookIdAndStatusIn(Long bookId, Collection<ReservationStatus> statuses);

    boolean existsByUserIdAndBookIdAndStatusIn(Long userId, Long bookId, Collection<ReservationStatus> statuses);

    boolean existsByBookIdAndStatus(Long bookId, ReservationStatus status);

    boolean existsByBookIdAndStatusIn(Long bookId, Collection<ReservationStatus> statuses);

    Optional<Reservation> findFirstByBookIdAndStatusOrderByCreatedAtAsc(Long bookId, ReservationStatus status);

    Optional<Reservation> findByBookItemIdAndStatus(Long bookItemId, ReservationStatus status);

    List<Reservation> findByStatusAndExpiryDateBefore(ReservationStatus status, LocalDateTime expiryDate);

    List<Reservation> findByBookIdAndStatusIn(Long bookId, Collection<ReservationStatus> statuses);
}
