package com.example.demo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "borrow_records")
public class BorrowRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_item_id")
    private BookItem bookItem;

    private LocalDateTime borrowDate = LocalDateTime.now();
    private LocalDateTime dueDate;     // Hạn trả
    private LocalDateTime returnDate;  // Ngày thực tế trả

    private Double fineAmount = 0.0;
    private String borrowMode = "TAKE_HOME";
    private Double depositAmount = 0.0;
    private String borrowerCitizenId;
    private Boolean temporaryRecord = false;
    private String incidentType;
    private String damageSeverity;
    private Double compensationAmount = 0.0;
    private String incidentNote;
    private Integer renewalCount = 0;

    @Enumerated(EnumType.STRING)
    private BookStatus status = BookStatus.BORROWING;
}