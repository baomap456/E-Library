package com.example.demo.dto.reports;

import java.util.List;

public record ReportsDiscardBooksResponse(
        String message,
        List<Long> discardedBookIds,
        int discardedCount) {
}
