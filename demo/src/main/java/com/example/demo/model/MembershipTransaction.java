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
import lombok.Data;

@Entity
@Data
@Table(name = "membership_transactions")
public class MembershipTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 100)
    private String actorUsername;

    @Column(length = 50)
    private String paymentChannel;

    @Column(length = 50)
    private String action;

    @Column(length = 100)
    private String fromPackage;

    @Column(length = 100)
    private String toPackage;

    private Double amount;

    @Column(length = 500)
    private String note;

    private LocalDateTime createdAt = LocalDateTime.now();
}
