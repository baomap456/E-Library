package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.MembershipTransaction;

public interface MembershipTransactionRepository extends JpaRepository<MembershipTransaction, Long> {
    List<MembershipTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
}
