package com.example.demo.dto.catalog;

public record CatalogShelfItemResponse(
        String barcode,
        Long bookId,
        String bookTitle,
        String room,
        String shelf,
        String status) {
}
