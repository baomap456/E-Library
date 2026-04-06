package com.example.demo.dto.reports;

public record ReportsDiscardCandidateResponse(
        String barcode,
        String title,
        String status,
        String criteriaCode,
        String criteriaLabel,
        String locationLabel,
        Integer publishYear,
        long borrowCount,
        Long lostDays) {
}
