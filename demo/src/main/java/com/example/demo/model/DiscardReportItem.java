package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "discard_report_items")
public class DiscardReportItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private DiscardReport report;

    @Column(nullable = false, length = 100)
    private String barcode;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "previous_status", nullable = false, length = 32)
    private String previousStatus;

    @Column(name = "criteria_code", nullable = false, length = 64)
    private String criteriaCode;
}
