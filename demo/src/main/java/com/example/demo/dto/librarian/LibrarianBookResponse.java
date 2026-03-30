package com.example.demo.dto.librarian;

public record LibrarianBookResponse(
        Long id,
        String title,
        String description,
        Integer publishYear,
        String publisher,
        String coverImageUrl,
        Boolean digital) {
}
