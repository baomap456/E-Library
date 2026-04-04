package com.example.demo.dto.reports;

public record ReportsFinancialResponse(
        String period,
        Double paidFineRevenue,
        Double outstandingDebt,
        Double cardFeeRevenue) {
}
