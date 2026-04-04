package com.example.demo.dto.reports;

import java.util.List;

public record ReportsKpiResponse(
        String period,
        long totalBorrows,
        double borrowingRate,
        double overdueUserRate,
        double membershipRevenue,
        double fineRevenue,
        List<ReportsTopBookItemResponse> topBorrowedBooks,
        List<ReportsTopBookItemResponse> topUnborrowedBooks,
        List<ReportsCategoryShareResponse> categoryDistribution,
        List<ReportsMonthlyUserGrowthResponse> newMembersByMonth) {
}
