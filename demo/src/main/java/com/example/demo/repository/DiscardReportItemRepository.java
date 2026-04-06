package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.DiscardReportItem;

public interface DiscardReportItemRepository extends JpaRepository<DiscardReportItem, Long> {
    List<DiscardReportItem> findByReportIdOrderByIdAsc(Long reportId);
}
