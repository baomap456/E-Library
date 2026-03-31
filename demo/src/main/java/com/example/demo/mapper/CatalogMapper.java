package com.example.demo.mapper;

import org.springframework.stereotype.Component;

import com.example.demo.dto.catalog.CatalogBookSearchResponse;
import com.example.demo.dto.catalog.CatalogShelfItemResponse;
import com.example.demo.dto.catalog.CatalogSimpleBookResponse;
import com.example.demo.model.Book;
import com.example.demo.model.BookItem;

@Component
public class CatalogMapper {

    public CatalogSimpleBookResponse toSimpleBook(Book book) {
        return new CatalogSimpleBookResponse(
                book.getId(),
                book.getTitle(),
                book.getIsbn() == null ? "" : book.getIsbn(),
                book.getPublishYear(),
                book.getCoverImageUrl() == null ? "" : book.getCoverImageUrl());
    }

    public CatalogBookSearchResponse toBookSearchResponse(
            Book book,
            long physicalAvailableItems,
            long pendingRequests,
            long availableItems,
            String inventoryStatus) {
        return new CatalogBookSearchResponse(
                book.getId(),
                book.getTitle(),
                book.getIsbn() == null ? "" : book.getIsbn(),
                book.getAuthors().stream().map(a -> a.getName()).toList(),
                book.getCategory() != null ? book.getCategory().getName() : "",
                book.getPublishYear(),
                book.getCoverImageUrl() == null ? "" : book.getCoverImageUrl(),
                inventoryStatus,
                physicalAvailableItems,
                pendingRequests,
                availableItems,
                book.isDigital());
    }

    public CatalogShelfItemResponse toShelfItemResponse(BookItem item) {
        return new CatalogShelfItemResponse(
                item.getBarcode(),
                item.getBook().getId(),
                item.getBook().getTitle(),
                item.getLocation().getRoomName(),
                item.getLocation().getShelfNumber(),
                item.getStatus().name());
    }
}
