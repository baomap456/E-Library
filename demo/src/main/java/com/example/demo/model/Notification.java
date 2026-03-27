package com.example.demo.model;

import java.time.LocalDateTime;

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
@Table(name = "notifications")
public class Notification {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;
    @ManyToOne 
    @JoinColumn(name = "user_id") 
    private User user;
    private String message;
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
