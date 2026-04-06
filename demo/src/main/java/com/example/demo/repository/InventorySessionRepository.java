package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.InventorySession;

public interface InventorySessionRepository extends JpaRepository<InventorySession, Long> {
    List<InventorySession> findAllByOrderByCreatedAtDesc();
}
