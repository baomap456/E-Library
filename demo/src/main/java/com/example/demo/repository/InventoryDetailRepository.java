package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.InventoryDetail;

public interface InventoryDetailRepository extends JpaRepository<InventoryDetail, Long> {
    boolean existsBySessionIdAndBarcode(Long sessionId, String barcode);

    long countBySessionId(Long sessionId);

    List<InventoryDetail> findBySessionId(Long sessionId);

    List<InventoryDetail> findBySessionIdOrderByScannedAtDesc(Long sessionId);
}
