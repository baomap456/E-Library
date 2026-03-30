package com.example.demo.dto.digital;

public record DigitalDocumentResponse(
        Long id,
        String title,
        Integer publishYear,
        String description,
        String format) {
}
