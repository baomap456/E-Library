package com.example.demo.dto.reports;

import java.util.List;

public record ReportsDiscardSuggestionsResponse(
        int totalSuggestions,
        int damagedSuggestions,
        int lostOver365Suggestions,
        int staleNoBorrowSuggestions,
        List<ReportsDiscardCandidateResponse> candidates) {
}
