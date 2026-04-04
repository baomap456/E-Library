package com.example.demo.dto.librarian;

public record LibrarianBookResponse(
        Long id,
        String title,
        String description,
        Integer publishYear,
        String publisher,
        Double price,
        String coverImageUrl,
        Boolean digital,
        Boolean canTakeHome,
        Long availableCopies,
        String availableBarcode) {
}
