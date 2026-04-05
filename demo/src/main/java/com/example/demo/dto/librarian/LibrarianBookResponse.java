package com.example.demo.dto.librarian;

import java.util.List;

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
        String availableBarcode,
        Integer categoryId,
        String categoryName,
        List<Integer> authorIds,
        List<String> authorNames,
        Integer locationId,
        String locationLabel) {
}
