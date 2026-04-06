package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.DiscardReport;

public interface DiscardReportRepository extends JpaRepository<DiscardReport, Long> {
    List<DiscardReport> findAllByOrderByCreatedAtDesc();
}
