package com.example.demo.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.MembershipTransaction;

public interface MembershipTransactionRepository extends JpaRepository<MembershipTransaction, Long> {
    List<MembershipTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<MembershipTransaction> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
}
