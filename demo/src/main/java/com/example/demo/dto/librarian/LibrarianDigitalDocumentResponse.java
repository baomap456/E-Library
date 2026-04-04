package com.example.demo.dto.librarian;

public record LibrarianDigitalDocumentResponse(
        Long id,
        String title,
        String description,
        Integer publishYear,
        String publisher,
        String fileUrl,
        String isbn) {
}
