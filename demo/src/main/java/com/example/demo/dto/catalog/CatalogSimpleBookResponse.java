package com.example.demo.dto.catalog;

public record CatalogSimpleBookResponse(
        Long id,
        String title,
        String isbn,
        Integer publishYear,
        String coverImageUrl) {
}
