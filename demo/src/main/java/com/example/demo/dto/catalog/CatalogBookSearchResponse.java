package com.example.demo.dto.catalog;

import java.util.List;

public record CatalogBookSearchResponse(
        Long id,
        String title,
        String isbn,
        List<String> author,
        String category,
        Integer publishYear,
        String coverImageUrl,
        String status,
        Long physicalAvailableItems,
        Long pendingRequests,
        Long availableItems,
        Boolean digital) {
}
