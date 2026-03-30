package com.example.demo.dto.catalog;

public record CatalogBookDetailResponse(
        CatalogSimpleBookResponse book,
        String description,
        String publisher,
        String location) {
}
