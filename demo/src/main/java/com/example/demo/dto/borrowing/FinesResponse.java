package com.example.demo.dto.borrowing;

import java.util.List;

public record FinesResponse(
        Double totalDebt,
        Integer unpaidCount,
        List<PaidFineHistoryResponse> paidHistory) {
}
