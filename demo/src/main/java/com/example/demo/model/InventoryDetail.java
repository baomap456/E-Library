package com.example.demo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Entity
@Data
@Table(
        name = "inventory_details",
        uniqueConstraints = @UniqueConstraint(columnNames = { "session_id", "barcode" }))
public class InventoryDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private InventorySession session;

    @Column(nullable = false, length = 100)
    private String barcode;

    @Column(name = "scanned_at", nullable = false)
    private LocalDateTime scannedAt = LocalDateTime.now();
}
