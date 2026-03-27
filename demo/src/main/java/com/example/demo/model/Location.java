package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity 
@Data 
@Table(name = "locations")
public class Location {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Integer id;
    private String roomName;
    private String shelfNumber;
}