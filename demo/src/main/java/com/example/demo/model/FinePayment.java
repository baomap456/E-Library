package com.example.demo.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class FinePayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "borrow_record_id")
    private BorrowRecord borrowRecord;

    private Double amount;
    private LocalDateTime paymentDate = LocalDateTime.now();
    private String paymentMethod; // MoMo, Tiền mặt, Banking
}
